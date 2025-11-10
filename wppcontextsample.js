
import { JSONEditor } from 'https://cdn.jsdelivr.net/npm/vanilla-jsoneditor@0.17.9/index.js'
import { createTheme } from '@wppopen/components-library';

const fetchContext = () => {
  const contentEl = $('.content')
  const contextEl = $('<div class="context"></div>')
  const openMenuButtonEl = $('<button class="action" disabled>Open burger menu</button>')
  const copyTokenButtonEl = $('<button class="action" disabled>Copy auth token</button>')

  contentEl.empty()
  contentEl.append(contextEl)
  contentEl.append(openMenuButtonEl)
  contentEl.append(copyTokenButtonEl)

  const contextEditor = new JSONEditor({
    target: contextEl.get(0),
    props: {
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      readOnly: true,
    },
  })

  const connection = window.Penpal.connectToParent({
    parentOrigin: '*',
    methods: {
      receiveOsContext: async osContext => {
        console.log(`%creceiveOsContext`, 'padding:5px 10px; background: #ffaa8c;')
        console.log(osContext)
        console.log('Test WPP--- OsContext', osContext)
        const theme = createTheme(osContext.themeData)
        console.log('Test WPP--- Theme JSON', theme)
      }
    }
  });

  connection.promise.then(context => {
    console.log(`%cConnection`, 'padding:5px 10px; background: #98c3ec;')
    console.log(context)

    openMenuButtonEl.removeAttr('disabled')
    openMenuButtonEl.click(() => {
      context.osApi.navigation.openMenu()
    })

    copyTokenButtonEl.removeAttr('disabled')
    copyTokenButtonEl.click(async e => {
      e.currentTarget.focus()

      const token = await context.osApi.getAccessToken()

      navigator.clipboard.writeText(token)
    })
  });
}
