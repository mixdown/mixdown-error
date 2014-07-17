var assert = require('assert');
var App = require('mixdown-app').App;
var MixdownError = require('../../index.js');
var HttpContext = require('mixdown-router/lib/http_context.js');
var MockRequest = require('hammock').Request;
var MockResponse = require('hammock').Response;

suite('Test error plugin', function() {
  var app = new App()

  // override the default namespace and make sure this still works.
  var namespace = 'errorHandler';

  setup(function(done) {

    app.use(new MixdownError({}), namespace);
    app.setup(done);
  });


  test('Test fail', function(done) {
    var httpContext = new HttpContext(new MockRequest({}), new MockResponse());
    var res = httpContext.response;
    var gold = '500 Error on page\n(if you get an http 200 then the request failed upstream)\nError: fail test\n    at Context.<anonymous>';

    res.on('end', function(err, data) {
      var body = data.body;

      assert.equal(res.statusCode, 500, 'Should return 500 status for fail');
      assert.equal(body.substring(0, gold.length), gold, 'Response should return correct error text (ignoring the stack trace which is always different).');
      done();
    });

    app[namespace].fail(new Error('fail test'), httpContext);

  });

  test('Test notFound', function(done) {
    var httpContext = new HttpContext(new MockRequest({
      url: '/foo'
    }), new MockResponse());
    var res = httpContext.response;
    var gold = '404 Not Found\n(if you get an http 200 then the request failed upstream)\nError: not found test\n    at Context.<anonymous>';

    res.on('end', function(err, data) {
      var body = data.body;

      assert.equal(res.statusCode, 404, 'Should return 404 status for not found');
      assert.equal(body.substring(0, gold.length), gold, 'Response should return correct error text (ignoring the stack trace which is always different).');
      done();
    });

    app[namespace].notFound(new Error('not found test'), httpContext);
  });

});
