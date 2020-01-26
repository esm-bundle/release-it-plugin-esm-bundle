const path = require('path')
const Plugin = require('release-it/lib/plugin/Plugin.js')
const packageJson = require(path.join(process.cwd(), './package.json'))

module.exports = class CustomVersion extends Plugin {
  getIncrementedVersionCI() {
    if (!packageJson.name) {
      throw Error(`package.json must have named with format '@esm-bundle/name'`)
    }

    const depName = packageJson.name.replace('@esm-bundle/', '') 
    const dependency = (packageJson.dependencies || {})[depName]
    if (!dependency) {
      throw Error(`Missing package.json dependency '${depName}'`)
    }

    const number = /[0-9.]+/.exec(dependency)[0]

    return number
  }
}