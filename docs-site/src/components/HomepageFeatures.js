import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

const FeatureList = [
  {
    title: 'Multi Domain',
    Svg: require('../../static/img/multi-domain.svg').default,
    description: (
      <>
        When it comes to dates, one size doesn't fit all. <code>Date</code>, <code>Time</code>, <code>ZonedDateTime</code>,
        etc. iso-fns has them all.
      </>
    )
  },
  {
    title: 'Immutable',
    Svg: require('../../static/img/immutable.svg').default,
    description: (
      <>Mutability makes your code harder to read, harder to write, and harder to debug. iso-fns avoids all that nonsense.</>
    )
  },
  {
    title: 'Functional',
    Svg: require('../../static/img/functional.svg').default,
    description: (
      <>
        Pure functions have no internal state ensuring consistent behavior. This makes them a joy to work with, so iso-fns
        uses them <i>everywhere</i>.
      </>
    )
  }
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
