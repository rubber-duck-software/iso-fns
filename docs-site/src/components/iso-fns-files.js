import isoSource from '!!raw-loader!../resources/out.d.ts'

export const files = [
  {
    // The real iso-fns type declarations, registered as a module at the
    // node_modules path so `import ... from 'iso-fns'` resolves. This file
    // has top-level import/export statements, so it is treated as a module.
    source: isoSource,
    path: 'file:///node_modules/iso-fns/index.d.ts'
  },
  {
    // Map the skypack CDN URL used in the playground to the iso-fns module.
    // Kept in its OWN file with no top-level import/export, so the
    // `declare module '<url>'` stays a global *ambient* module declaration
    // rather than being demoted to a module augmentation (which would not
    // register the module and would surface a TS 2307 in the editor).
    source: `declare module 'https://cdn.skypack.dev/iso-fns@beta' {
  export * from 'iso-fns'
}`,
    path: 'file:///iso-fns-cdn-shim.d.ts'
  }
]
