import shell from 'shelljs'
import fs from 'node:fs'

const { exec } = shell

const API_DIR = './docs-site/docs/api'
const TYPE_ALIASES_DIR = `${API_DIR}/iso-fns/namespaces/Iso/type-aliases`
const INTERFACES_DIR = `${API_DIR}/interfaces`
const RESOURCES_DTS = './docs-site/src/resources/out.d.ts'
const BUNDLED_DTS = './dist/index.d.mts'

// The Iso types, in the order they appear in the docs sidebar. Each has a matching
// `I<Type>Fns` interface (its functions) and an `Iso.<Type>` type alias (its description).
const TYPES = ['Instant', 'ZonedDateTime', 'Date', 'Time', 'DateTime', 'YearMonth', 'MonthDay', 'Duration']

main()

function main() {
  generateApiDocs()
  copyTypeDefinitions()
  exec('cd docs-site; pnpm build;')
}

// Run typedoc, then fold each type's description and function reference into a single
// Docusaurus page, and discard typedoc's intermediate output.
function generateApiDocs() {
  exec(`rm -rf ${API_DIR}`)
  exec('pnpm exec typedoc')

  TYPES.forEach((type, index) => writeTypePage(type, index))

  exec(`rm -rf ${API_DIR}/iso-fns ${API_DIR}/interfaces ${API_DIR}/README.md`)
  fs.writeFileSync(`${API_DIR}/_category_.json`, JSON.stringify({ position: 4, label: 'API' }))
}

// The docs site embeds the library's bundled declarations as raw text for its live
// playground. tsdown already emits that bundle, so reuse it instead of a separate build.
function copyTypeDefinitions() {
  if (!fs.existsSync(BUNDLED_DTS)) exec('pnpm build')
  fs.mkdirSync('./docs-site/src/resources', { recursive: true })
  fs.copyFileSync(BUNDLED_DTS, RESOURCES_DTS)
}

function writeTypePage(type, index) {
  const description = extractDescription(`${TYPE_ALIASES_DIR}/${type}.md`)
  const methods = extractMethods(`${INTERFACES_DIR}/I${type}Fns.md`)
  const frontMatter = `---\ntitle: ${type}\nsidebar_position: ${index + 4}\nhide_title: true\n---\n`
  fs.writeFileSync(`${API_DIR}/${type}.md`, `${frontMatter}\n${description}\n\n${methods}\n`)
}

// The prose between the type-alias signature and its (internal) type declaration.
function extractDescription(path) {
  let content = fs.readFileSync(path, 'utf8')
  const declarationIndex = content.indexOf('\n## Type Declaration')
  if (declarationIndex !== -1) content = content.slice(0, declarationIndex)

  const lines = content.split('\n').filter((line) => !/^# Type Alias:/.test(line))
  // Skip the leading blank lines and the `> **Type** = ...` signature block.
  let start = 0
  while (start < lines.length && (lines[start].trim() === '' || lines[start].startsWith('>'))) start++
  return lines.slice(start).join('\n').trim()
}

// The interface's methods, promoted one heading level and with cross-type links flattened.
function extractMethods(path) {
  const content = fs
    .readFileSync(path, 'utf8')
    .replace(/^# Interface:.*\n/m, '')
    .replace(/^## Methods\s*\n/m, '')
    .replace(/^(#{3,6}) /gm, (_, hashes) => '#'.repeat(hashes.length - 1) + ' ')
    .replace(/\.\.\/README\.md/g, '../BasicTypes.md')
  return repairReferences(content).trim()
}

// typedoc links each type to its own nested file; rewrite those to the flat sibling pages.
function repairReferences(content) {
  const references = new Set(Array.from(content.matchAll(/\(\.\.[^)]*?\.md[^)]*?\)/g), (m) => m[0]))
  for (const reference of references) {
    const replacement = getNewReference(reference)
    if (replacement) content = content.split(reference).join(replacement)
  }
  return content
}

function getNewReference(reference) {
  const [pathPart, anchor] = reference.split('#')
  const type = getTypeForReference(pathPart)
  if (!type) return null
  const hash = anchor ? `#${anchor.replace(')', '')}` : ''
  return `(./${type}.md${hash})`
}

// Map a reference path to its owning type page. Order matters: more specific names first.
function getTypeForReference(reference) {
  const name = reference.toLowerCase()
  if (name.includes('instant')) return 'Instant'
  if (name.includes('zoneddatetime')) return 'ZonedDateTime'
  if (name.includes('datetime')) return 'DateTime'
  if (name.includes('date')) return 'Date'
  if (name.includes('time')) return 'Time'
  if (name.includes('yearmonth')) return 'YearMonth'
  if (name.includes('monthday')) return 'MonthDay'
  if (name.includes('duration')) return 'Duration'
  return null
}
