/* eslint-disable */
import fs from 'fs-extra'
import YAML from 'yaml'
import { paths } from './paths.mjs'

export const getConfig = () => {
  const electron_builder_yml = fs.readFileSync(paths.root('electron-builder.yml'), 'utf8')
  const package_json = fs.readFileSync(paths.root('package.json'), 'utf8')
  return {
    electronBuilder: YAML.parse(electron_builder_yml),
    package: JSON.parse(package_json)
  }
}
