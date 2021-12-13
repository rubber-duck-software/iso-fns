const { exec } = require('shelljs')
const fs = require('fs')

exec('rm -rf ./docs-site/docs/api')
exec('yarn run typedoc --sort source-order --excludeInternal --hideGenerator')

const rootFolder = './docs-site/docs/api'

const FileNames = {
  Instant: 'Instant',
  ZonedDateTime: 'ZonedDateTime',
  Date: 'Date',
  Time: 'Time',
  DateTime: 'DateTime',
  YearMonth: 'YearMonth',
  MonthDay: 'MonthDay',
  Duration: 'Duration'
}

function GetFileName(fileName) {
  if (fileName.toLowerCase().includes('instant')) {
    return FileNames.Instant
  } else if (fileName.toLowerCase().includes('zoneddatetime')) {
    return FileNames.ZonedDateTime
  } else if (fileName.toLowerCase().includes('datetime')) {
    return FileNames.DateTime
  } else if (fileName.toLowerCase().includes('date')) {
    return FileNames.Date
  } else if (fileName.toLowerCase().includes('time')) {
    return FileNames.Time
  } else if (fileName.toLowerCase().includes('yearmonth')) {
    return FileNames.YearMonth
  } else if (fileName.toLowerCase().includes('monthday')) {
    return FileNames.MonthDay
  } else if (fileName.toLowerCase().includes('duration')) {
    return FileNames.Duration
  } else {
    throw new Error(`Unrecognized file name ${fileName}`)
  }
}

function FixIsoTypes() {
  const interfaces = fs.readdirSync(`${rootFolder}/interfaces`).filter((fileName) => fileName.includes('Fns'))

  const path = `${rootFolder}/modules/Iso.md`

  const intro = fs.readFileSync(path).toString()

  const headings = Object.values(FileNames)
  headings.forEach((h, i) => {
    const start = intro.indexOf(`### ${h}`)
    const end = intro.indexOf('___', start)
    let newContent = intro.slice(start + 2, end)
    const folder = GetFileName(h)
    const myInterface = interfaces.find((fileName) => GetFileName(fileName) === folder)
    const interfacePath = `${rootFolder}/interfaces/${myInterface}`
    const startingFileContent = fs.readFileSync(interfacePath).toString()
    let newBody = startingFileContent
      .replace(/# .*\n/, '')
      .replace(`\n## Methods\n`, '')
      .replace(/\.\.\/README.md/g, '../BasicTypes.md')
      .replace(/\n### /g, '\n## ')
    newBody = repairReferences(newBody)

    const frontMatter = `---
title: ${folder}
sidebar_position: ${i + 4}
hide_title: true
---
`
    newContent = frontMatter + newContent + newBody
    fs.writeFileSync(`${rootFolder}/${h}.md`, newContent)

    fs.rmSync(interfacePath)
  })

  fs.writeFileSync(`${rootFolder}/_category_.json`, JSON.stringify({ position: 4, label: 'API' }))

  fs.rmSync(path)
  fs.rmdirSync(`${rootFolder}/modules`)
  fs.rmdirSync(`${rootFolder}/interfaces`)
}

FixIsoTypes()

fs.rmSync(`${rootFolder}/README.md`)

/**
 *
 * @param {string} reference
 */
function getNewReference(reference) {
  const fileName = GetFileName(reference)
  return `(./${fileName}.md)`
}

/**
 *
 * @param {string} content
 */
function repairReferences(content) {
  const matches = Array.from(content.matchAll(/\(.*?md.*?\)/g), (m) => m[0])
  const references = [
    ...new Set(
      matches.map((m) => {
        const start = m.lastIndexOf('(')
        const end = m.lastIndexOf(')')
        return m.slice(start, end + 1)
      })
    )
  ]
  references.forEach((r) => {
    const newReference = getNewReference(r)
    while (content.includes(r)) {
      content = content.replace(r, newReference)
    }
  })
  return content
}

exec('cd docs-site; yarn build;')
