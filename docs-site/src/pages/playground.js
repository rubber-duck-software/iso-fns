import Monaco from '../components/Monaco'
import Layout from '@theme/Layout'

import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function () {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={`${siteConfig.title} Playground`} description="Use this playground to start experimenting with iso-fns">
      <main>
        <div className="container">
          <h1>Playground</h1>
          <h5>
            Welcome! This integrated typescript editor is for you! Please play around with it all you like. You can check
            function results and any error messages in the console below. Have fun!
          </h5>

          <Monaco />
        </div>
      </main>
    </Layout>
  )
}
