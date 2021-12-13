/** @type {import('typedoc').TypeDocOptions} */
const config = {
  tsconfig: './tsconfig.json',
  entryPoints: ['src/types', 'src/iso-types.ts'],
  entryPointStrategy: 'expand',
  readme: 'none',
  out: 'docs-site/docs/api',
  plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-merge-modules'],
  readme: 'none',
  hideBreadcrumbs: true,
  hideInPageTOC: true
}

module.exports = config
