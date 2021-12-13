// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/vsLight')
const darkCodeTheme = require('prism-react-renderer/themes/vsDark')

/** @type {import('@docusaurus/types').Config} */
const config = {
  themes: ['@docusaurus/theme-live-codeblock'],
  title: 'iso-fns',
  tagline: 'A string based date time library',
  url: 'https://iso-fns.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'rubber-duck-software', // Usually your GitHub org/user name.
  projectName: 'iso-fns', // Usually your repo name.
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'iso-fns',
        logo: {
          alt: 'iso-fns logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation'
          },
          {
            href: 'https://github.com/rubber-duck-software/iso-fns',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/rubber-duck-software/iso-fns'
              }
            ]
          }
        ]
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      },
      colorMode: {
        defaultMode: 'dark'
      }
    })
}

module.exports = config
