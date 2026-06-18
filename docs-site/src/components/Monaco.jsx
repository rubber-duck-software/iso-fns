import React, { useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useColorMode } from '@docusaurus/theme-common' //docs: https://docusaurus.io/docs/2.4.3/api/themes/configuration#use-color-mode
import { files } from './iso-fns-files'
import { Console, Hook, Unhook } from 'console-feed'
import styles from './Monaco.module.css'

export default function TypescriptLoader() {
  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => {
    if (document) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/typescript@latest/lib/typescript.js'
      script.type = 'text/javascript'
      script.addEventListener('load', () => setLoaded(true))

      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
        setLoaded(false)
      }
    }
  }, [setLoaded])
  if (loaded) {
    return <Monaco />
  } else {
    return null
  }
}

const startingValue = `import { dateFns, timeFns, zonedDateTimeFns, dateTimeFns, instantFns, yearMonthFns, monthDayFns, durationFns, Iso } from 'https://esm.sh/iso-fns@beta'

const result = dateFns.add("2000-01-01", {days:1})
console.log(result)`

function Monaco() {
  const monaco = useMonaco()
  const { colorMode } = useColorMode()
  const isDarkTheme = colorMode === 'dark'
  const editorRef = React.useRef(null)
  const [copied, setCopied] = React.useState(false)
  const [logs, setLogs] = React.useState([])

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ES2016,
        noEmit: true,
        lib: ['dom'],
        typeRoots: ['node_modules/@types']
      })
      monaco.languages.typescript.typescriptDefaults.pre
      files.forEach((f) => monaco.languages.typescript.typescriptDefaults.addExtraLib(f.source, f.path))
    }
  }, [monaco])

  const [js, setJs] = React.useState(window.ts.transpile(startingValue, { module: 'ES6' }))
  const onChange = React.useCallback((value) => {
    const jsCode = window.ts.transpile(value, { module: 'ES6' })
    setJs(jsCode)
  }, [])

  const handleReset = React.useCallback(() => {
    editorRef.current?.setValue(startingValue)
  }, [])

  const handleCopy = React.useCallback(async () => {
    const value = editorRef.current ? editorRef.current.getValue() : startingValue
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      /* clipboard unavailable — ignore */
    }
  }, [])

  return (
    <div className={styles.card}>
      <div className={`${styles.bar} ${styles.editorBar}`}>
        <span className={styles.fileLabel}>
          <span className={styles.dots} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </span>
          playground.ts
        </span>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={handleReset}>
            <ResetIcon />
            Reset
          </button>
          <button
            type="button"
            className={`${styles.btn} ${copied ? styles.btnConfirmed : ''}`}
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <Editor
        theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
        height="360px"
        defaultValue={startingValue}
        defaultLanguage="typescript"
        onMount={(editor) => {
          editorRef.current = editor
        }}
        options={{
          minimap: {
            enabled: false
          },
          scrollbar: {
            vertical: 'hidden'
          },
          // Render hover/suggestion popovers in a fixed position so they aren't
          // clipped by the card's `overflow: hidden`.
          fixedOverflowWidgets: true,
          padding: { top: 16, bottom: 16 },
          fontSize: 14,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true
        }}
        onChange={onChange}
      />

      <div className={`${styles.bar} ${styles.consoleBar}`}>
        <span className={styles.consoleTitle}>
          <span className={styles.liveDot} aria-hidden="true" />
          Console
        </span>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => setLogs([])}>
            <ClearIcon />
            Clear
          </button>
        </div>
      </div>

      <div className={styles.consoleBody}>
        {logs.length === 0 && <p className={styles.empty}>// Output will appear here as your code runs.</p>}
        <LogsContainer jsCode={js} variant={isDarkTheme ? 'dark' : 'light'} logs={logs} setLogs={setLogs} />
      </div>
    </div>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  )
}

const LogsContainer = ({ jsCode, variant, logs, setLogs }) => {
  useEffect(() => {
    Hook(
      window.console,
      (log) => {
        setLogs((currLogs) => [...currLogs, log])
      },
      false
    )
    // Surface async/uncaught errors in the console instead of letting them
    // bubble up to the dev error overlay and blow up the screen.
    const handleError = function (event) {
      event.preventDefault()
      if (event.error) {
        console.error(event.error.message ?? String(event.error))
      }
    }
    const handleRejection = function (event) {
      event.preventDefault()
      const reason = event.reason
      console.error(reason?.message ?? String(reason))
    }
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      Unhook(window.console)
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  React.useEffect(() => {
    setLogs([])
    if (document) {
      const script = document.createElement('script')
      const { imports, rest } = splitImports(jsCode)
      script.innerText = `${imports}
  try {
  ${rest}
  } catch (e) {
    console.error(e && e.message ? e.message : String(e))
  }`
      script.type = 'module'
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [jsCode, setLogs])

  if (variant === 'dark') {
    return (
      <Console
        key="dark-console"
        logs={logs}
        variant="dark"
        styles={{
          LOG_COLOR: 'rgba(255,255,255,0.92)',
          LOG_BORDER: 'rgba(255,255,255,0.1)',
          LOG_WARN_BACKGROUND: 'hsl(50deg 60% 14%)',
          LOG_WARN_BORDER: 'hsl(50deg 60% 22%)',
          LOG_WARN_COLOR: 'hsl(48deg 100% 80%)',
          LOG_ERROR_BACKGROUND: 'hsl(0deg 50% 16%)',
          LOG_ERROR_BORDER: 'hsl(0deg 50% 26%)',
          LOG_ERROR_COLOR: 'hsl(0deg 100% 82%)',
          LOG_AMOUNT_COLOR: '#fff'
        }}
      />
    )
  } else {
    return (
      <Console
        key="light-console"
        logs={logs}
        styles={{
          LOG_COLOR: 'rgba(0,0,0,0.9)',
          LOG_BORDER: 'rgb(240, 240, 240)',
          LOG_WARN_BACKGROUND: 'hsl(50deg 100% 95%)',
          LOG_WARN_BORDER: 'hsl(50deg 100% 88%)',
          LOG_WARN_COLOR: 'hsl(39deg 100% 18%)',
          LOG_ERROR_BACKGROUND: 'hsl(0deg 100% 97%)',
          LOG_ERROR_BORDER: 'rgb(0deg 100% 92%)',
          LOG_ERROR_COLOR: '#f00',
          LOG_AMOUNT_COLOR: '#fff'
        }}
      />
    )
  }
}

function splitImports(code) {
  const lines = code.split('\n')
  const imports = lines.filter((l) => l.includes('import ')).join('\n')
  const rest = lines.filter((l) => !l.includes('import ')).join('\n')
  return { imports, rest }
}
