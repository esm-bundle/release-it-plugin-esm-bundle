const path = require('path')
const Plugin = require('release-it/lib/plugin/Plugin.js')
const packageJson = require(path.join(process.cwd(), './package.json'))

module.exports = class CustomVersion extends Plugin {
  static disablePlugin() {
    const depVersion = getDepVersion()
    const currentPackageVersion = packageJson.version

    if (currentPackageVersion.startsWith(depVersion)) {
      return ['git', 'github', 'npm', 'version']
    } else {
      return []
    }
  }
  getIncrementedVersionCI() {
    return getDepVersion()
  }
}

function getDepName() {
  if (!packageJson.name) {
    throw Error(`package.json must have named with format '@esm-bundle/name'`)
  }

  return packageJson.name.replace('@esm-bundle/', '') 
}

function getDepVersion() {
  const depName = getDepName()
  const dependency = (packageJson.dependencies || {})[depName]
  if (!dependency) {
    throw Error(`Missing package.json dependency '${depName}'`)
  }

  return /[0-9.]+/.exec(dependency)[0]

}