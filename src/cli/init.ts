import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import mkdirp from 'mkdirp'
import cpFile from 'cp-file'
import kleur from 'kleur'
import { installTemplates } from './install-templates'

interface Options {
  name: string
  author: string
  version: string
  url: string
  license: string
  airline: boolean
  lightline: boolean
  description: string
}

const blankTermOrigin = path.resolve(__dirname, '../../templates/terminal.yml')
const defaultPalette = 'myblue: \'#99ccff\''

export function init (projectPath: string, noQuestions: boolean) {
  const folderName = path.basename(projectPath)

  if (noQuestions) {
    return createBoilerplate(projectPath, {
      name: folderName,
      author: '',
      version: '1.0.0',
      url: '',
      license: 'MIT',
      airline: true,
      lightline: true,
      description: ''
    })
  }

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: folderName
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: '1.0.0'
    },
    {
      type: 'input',
      name: 'license',
      message: 'License:',
      default: 'MIT'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:'
    },
    {
      type: 'input',
      name: 'url',
      message: 'Project url:'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Short description:'
    }
  ]

  inquirer.prompt(questions).then(function (answers) {
    createBoilerplate(projectPath, answers as unknown as Options)
  })
}

async function createBoilerplate (projectPath: string, options: Options) {
  const addonsFolder = path.resolve(projectPath, 'estilo/addons')
  const termPath = path.resolve(addonsFolder, 'terminal.yml')
  const estiloStr = `name: '${options.name}'
version: '${options.version || ''}'
license: '${options.license || ''}'
author: '${options.author || ''}'
url: '${options.url || ''}'
description: '${options.description || ''}'
colorschemes:
  - name: ${options.name}
    background: 'dark'
    palette: ${options.name}`

  fs.writeFileSync(path.resolve(projectPath, 'estilo.yml'), estiloStr)
  const palettesPath = path.resolve(projectPath, 'estilo', 'palettes')
  mkdirp.sync(path.resolve(projectPath, 'estilo'))
  mkdirp.sync(path.resolve(projectPath, 'estilo', 'syntax'))
  mkdirp.sync(palettesPath)
  mkdirp.sync(addonsFolder)
  fs.writeFileSync(path.resolve(palettesPath, options.name + '.yml'), defaultPalette)
  await cpFile(blankTermOrigin, termPath)
  installTemplates(['base.yml'])
  console.log(kleur.green().bold('✓  Your project is ready\n'))
}
