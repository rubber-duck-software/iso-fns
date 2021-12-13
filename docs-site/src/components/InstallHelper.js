import React from 'react';
import styles from './InstallHelper.module.css';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

export default function InstallHelper() {
  return (
    <section className={styles.installHelper}>
      <div className="container">
        <Tabs>
          <TabItem value="npm" label="NPM" default>
            <CodeBlock className="language-bash">npm install iso-fns</CodeBlock>
          </TabItem>
          <TabItem value="yarn" label="Yarn">
            <CodeBlock className="language-bash">yarn add iso-fns</CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </section>
  );
}
