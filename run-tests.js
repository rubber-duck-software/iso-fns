const fs = require('fs')
const path = require('path')
const beartest = require('beartest-js')

/**
 *
 * @param {string} dir
 * @param {boolean} [inTestDirectory]
 * @returns {Promise<string[]>}
 */
async function getFiles(dir, inTestDirectory) {
  const contents = await fs.promises.readdir(dir, { withFileTypes: true })
  const subDirectories = contents
    .filter((f) => f.isDirectory())
    .map((d) => d.name)
    .filter((name) => name !== 'node_modules')
  const files = contents.filter((f) => !f.isDirectory())
  const testFiles = files
    .map((f) => ({
      name: f.name,
      basename: f.name.slice(0, f.name.lastIndexOf('.')),
      extension: f.name.slice(f.name.lastIndexOf('.'))
    }))
    .filter((f) => ['.js', '.cjs', '.mjs', '.ts', '.jsx', '.tsx'].includes(f.extension))
    .filter((f) => {
      if (inTestDirectory) {
        return true
      } else {
        // eslint-disable-next-line no-useless-escape
        return /^test$/.test(f.basename) || /.+[\.]test$/.test(f.basename) // || /^test-.+/.test(f.basename)
      }
    })
    .map((f) => path.resolve(dir, f.name))
  const subDirTestFiles = await Promise.all(
    subDirectories.map((subDir) => getFiles(path.join(dir, subDir), inTestDirectory || subDir === 'test'))
  ).then((r) => r.flatMap((r) => r))

  return [...testFiles, ...subDirTestFiles]
}

async function runTests() {
  try {
    const files = await getFiles('./')

    for (const file of files) {
      process.stdout.write(`\u001b[34m${path.parse(file).name} (${path.relative('./', file)})\u001b[39m\n`)
      require(file)
      await beartest.runner.waitForTests()
    }
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

runTests()
