var assert = require('assert');
var Pluggo = require('pluggo');
var Response = require('hammock').Response;
var ErrorPlugin = require('../../index.js');

suite('Test error plugin', function() {
  var app = {
    plugins: new Pluggo()
  };

  // override the default namespace and make sure this still works.
  var namespace = 'errorHandler';

  setup(function(done) {

    app.plugins.use(new ErrorPlugin(namespace), {});
    app.plugins.init(done);
  });

  test('Test fail', function(done) {
    var res = new Response();
    var gold = '500 Error on page\nfail test\nError: fail test\n    at Context.<anonymous>';

    res.on('close', function() {
      var body = res.buffer.join('');

      assert.equal(res.statusCode, 500, 'Should return 500 status for fail');
      assert.equal(body.substring(0, gold.length), gold, 'Response should return correct error text (ignoring the stack trace which is always different).');
      done();
    });

    app.plugins[namespace].fail(new Error('fail test'), res);

  });

  test('Test notFound', function(done) {
    var res = new Response();
    var gold = '404 Not Found\nnot found test\nError: not found test\n    at Context.<anonymous>';

    res.on('close', function() {
      var body = res.buffer.join('');

      assert.equal(res.statusCode, 404, 'Should return 404 status for not found');
      assert.equal(body.substring(0, gold.length), gold, 'Response should return correct error text (ignoring the stack trace which is always different).');
      done();
    });

    app.plugins[namespace].notFound(new Error('not found test'), res);
  });
  

});