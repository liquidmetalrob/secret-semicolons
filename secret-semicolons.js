'use babel'

import { CompositeDisposable } from 'atom'
const $ = require('jquery')
var ext, _editor_
var keys_before = {
  'ArrowLeft': 1,
  'ArrowUp': 1,
  'ArrowDown': 1,
  'End': 1,
}

export default {

  activate() {
    console.log('activate')
    self = this
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.workspace.observeActivePaneItem(function(editor) {
        _editor_ = editor
        try {
          var filename = editor.getFileName()
          ext = (arr = editor.getFileName().split('.'))[arr.length-1||1]
        } catch(e) {
          ext = undefined
        }
      }),
      atom.commands.onDidDispatch(function(e) {
        if (ext == 'css') {
          var new_ = _editor_.getCursorBufferPosition()
          if (e.originalEvent.key in keys_before) {
            self.handle_position(_editor_, new_, 1)
          } else {
            self.handle_position(_editor_, new_)
          }
        }
      }),
    )
    $('body').on('click', '.line', this.liner)
  },

  liner(e) {
    if (ext == 'css') {
      var new_ = _editor_.getCursorBufferPosition()
      self.handle_position(_editor_, new_, 1)
    }
  },

  handle_position(editor, new_, before) {
    var end = editor.getBuffer().rangeForRow(new_.row).end.column
    if (new_.column == end && editor.lineTextForBufferRow(new_.row)[end-1] == ';') {
      if (before) {
        editor.setCursorBufferPosition([new_.row, end-1])
      } else {
        editor.setCursorBufferPosition([new_.row+1, 0])
      }
    }
  },

  deactivate() {
    this.subscriptions.dispose()
    $('body').off('click', '.line', this.liner)
  },

}
