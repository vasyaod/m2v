let url = "http://m2v.f-proj.com:8882"

/* #!if isElectron */
url = "http://localhost:8882"
/* #!endif */

module.exports = {
  renderServerUrl: url
}
