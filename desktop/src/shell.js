// Modules to control application life and create native browser window
const {shell} = require('electron')

exports.openItem = (fullPath) => {
  console.log(fullPath)
  shell.openItem(fullPath)
}

exports.openFolder = (fullPath) => {
  console.log(fullPath)
  shell.showItemInFolder(fullPath)
}
