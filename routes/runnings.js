//runnings js file to add footer to created pdf file. see downpage.js:124
exports.header = null

exports.footer =  {
  contents: function(pageNum, numPages) {
    return "<footer>  <span style='float:right'>" + pageNum + " / " + numPages + "</span></footer>"
  },
  height: '1cm'
}
