var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');

module.exports = BasePlugin.extend({
  fail: function(err, httpContext, headers) {
    var res = httpContext.response;
    if (!res.headersSent) {
      res.writeHead(500, _.extend({
        'Content-Type': 'text/plain'
      }, headers));
    }

    res.end('500 Error on page\n(if you get an http 200 then the request failed upstream)\nError: fail test\n    at Context.<anonymous>' + this.formatError(err));
  },

  notFound: function(err, httpContext, headers) {
    var res = httpContext.response;
    if (!res.headersSent) {
      res.writeHead(404, _.extend({
        'Content-Type': 'text/plain'
      }, headers));
    }

    res.end('404 Not Found\n(if you get an http 200 then the request failed upstream)\nError: not found test\n    at Context.<anonymous>' + this.formatError(err));
  },

  formatError: function(err) {

    var msg = '';

    if (typeof(err) === 'string') {
      return err;
    }

    if (err && err.message) {
      msg += err.message;
    }

    if (err && err.stack) {
      msg += '\n' + err.stack;
    }

    return msg;
  }
});
