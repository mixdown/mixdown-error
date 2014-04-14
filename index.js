var _ = require('lodash');

module.exports = function(namespace) {
  namespace = namespace || 'error';

  this.attach = function(options) {

    // handle the weirdness of errors in javascript
    var formatError = function(err) {
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
    };

    this[namespace] = {

      fail: function(err, res, headers) {
        if (!res.headersSent) {
          res.writeHead(500, _.extend({ 'Content-Type': 'text/plain'}, headers) );
        }
        
        res.end('500 Error on page (if you got http 200, then the response failed mid-stream)\n' + formatError(err));
      },

      notFound: function(err, res, headers) {
        if (!res.headersSent) {
          res.writeHead(404, _.extend({ 'Content-Type': 'text/plain'}, headers) );
        }
        res.end('404 Not Found (if you got http 200, then the response failed mid-stream)\n' + formatError(err));
      }

    };

  };
};
