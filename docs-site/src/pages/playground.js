import Layout from '@theme/Layout'
import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './playground.module.css'

export default function Playground() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={`${siteConfig.title} Playground`} description="Use this playground to start experimenting with iso-fns">
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              Interactive editor
            </p>
            <h1 className={styles.title}>Playground</h1>
            <p className={styles.subtitle}>
              A live TypeScript editor wired up to iso-fns. Edit the code and your results — and any errors — appear in
              the console below as you type.
            </p>
          </header>

          <BrowserOnly>
            {() => {
              const Monaco = require('../components/Monaco').default

              return <Monaco />
            }}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  )
}
