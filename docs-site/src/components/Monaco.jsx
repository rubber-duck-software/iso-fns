import React, { useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import useThemeContext from '@theme/hooks/useThemeContext' //docs: https://v2.docusaurus.io/docs/2.0.0-alpha.69/theme-classic#usethemecontext
import { files } from './iso-fns-files'
import { Console, Hook, Unhook } from 'console-feed'
import BrowserOnly from '@docusaurus/BrowserOnly'

export default function () {
  return <BrowserOnly>{() => <TypescriptLoader />}</BrowserOnly>
}
function TypescriptLoader() {
  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => {
    if (document) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/typescript@latest/lib/typescriptServices.js'
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

const startingValue = `import { dateFns } from 'https://cdn.skypack.dev/iso-fns@alpha'

const result = dateFns.add("2000-01-01", {days:1})
console.log(result)`

function Monaco() {
  const monaco = useMonaco()
  const { isDarkTheme } = useThemeContext()

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
  })

  return (
    <>
      <div>
        <Editor
          theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
          height="300px"
          defaultValue={startingValue}
          defaultLanguage="typescript"
          options={{
            minimap: {
              enabled: false
            },
            scrollbar: {
              vertical: 'hidden'
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true
          }}
          onChange={onChange}
        />
      </div>
      <div style={{ backgroundColor: isDarkTheme ? '#242424' : '#F8F8F8', minHeight: 100 }}>
        <LogsContainer jsCode={js} variant={isDarkTheme ? 'dark' : 'light'} />
      </div>
    </>
  )
}

const LogsContainer = ({ jsCode, variant }) => {
  const [logs, setLogs] = React.useState([])

  useEffect(() => {
    Hook(
      window.console,
      (log) => {
        setLogs((currLogs) => [...currLogs, log])
      },
      false
    )
    const handleError = function (event) {
      if (event.error) {
        console.error(event.error.message)
      }
      return true
    }
    window.addEventListener('error', handleError)

    return () => {
      Unhook(window.console)
      window.removeEventListener('error', handleError)
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
    throw e
  }`
      script.type = 'module'
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [jsCode, setLogs])

  if (variant === 'dark') {
    return <Console key="dark-console" logs={logs} />
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
