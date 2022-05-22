import fs from "node:fs";
import path from "node:path";
import { Plugin } from "release-it";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "./package.json")).toString()
);

export default class CustomVersion extends Plugin {
  static disablePlugin() {
    const depVersion = getDepVersion();
    const currentPackageVersion = packageJson.version;

    if (currentPackageVersion.startsWith(depVersion)) {
      console.info(
        "Disabling release-it because this version is already published"
      );
      return ["git", "github", "npm", "version"];
    } else {
      return [];
    }
  }
  getIncrementedVersionCI() {
    return getDepVersion();
  }
}

function getDepName() {
  if (!packageJson.name) {
    throw Error(`package.json must have named with format '@esm-bundle/name'`);
  }

  const withoutPrefix = packageJson.name.replace("@esm-bundle/", "");
  const [scope, name] = withoutPrefix.split("__");
  if (name) {
    // a scoped package
    return `@${scope}/${name}`;
  } else {
    return scope;
  }
}

function getDepVersion() {
  const depName = getDepName();
  const dependency = (packageJson.devDependencies || {})[depName];
  if (!dependency) {
    throw Error(`Missing package.json dependency '${depName}'`);
  }

  return /[0-9.]+/.exec(dependency)[0];
}
