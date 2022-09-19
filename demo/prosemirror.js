/* eslint-env browser */

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo, prosemirrorToYDoc } from '../src/y-prosemirror.js'
import { EditorState, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from './schema.js'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'

let ENABLE_YJS = true

window.addEventListener('load', () => {
  const doc = schema.nodes.doc.createChecked(null, [
    schema.nodes.heading.createChecked({level: 1}, schema.text("Welcome to y-prosemirror!")),
    schema.nodes.paragraph.createChecked(null, schema.text("Hello"))
  ])
  const selection = TextSelection.create(doc, 12, 25) // select "y-prosemirror" in the heading
  const ydoc = prosemirrorToYDoc(doc)
  // const provider = new WebrtcProvider('prosemirror-debug', ydoc)
  const type = ydoc.getXmlFragment('prosemirror')

  const editor = document.createElement('div')
  editor.setAttribute('id', 'editor')
  const editorContainer = document.createElement('div')
  editorContainer.insertBefore(editor, null)
  const prosemirrorView = new EditorView(editor, {
    state: EditorState.create({
      doc,
      selection,
      schema,
      plugins: (ENABLE_YJS ? [
        ySyncPlugin(type),
        // yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo
        })
      ] : []).concat(exampleSetup({ schema }))
    })
  })
  document.body.insertBefore(editorContainer, null)  

  setTimeout(() => {
    console.log('focus')
    prosemirrorView.focus()
  })

  // const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  // connectBtn.addEventListener('click', () => {
  //   if (provider.shouldConnect) {
  //     provider.disconnect()
  //     connectBtn.textContent = 'Connect'
  //   } else {
  //     provider.connect()
  //     connectBtn.textContent = 'Disconnect'
  //   }
  // })

  // @ts-ignore
  window.example = { ydoc, type, prosemirrorView }
})
