/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

	let book_id

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {

		  chai
		  	.request(server)
		  	.keepOpen()
		  	.post('/api/books')
		  	.send({
				title: 'Berserk'
			})
		  	.end((err, res) => {
				assert.equal(res.status, 200, 'Response status should be 200')
				assert.strictEqual(typeof res.body, 'object', 'Response should be an object')

				assert.equal(res.body.title, 'Berserk', 'Response title should match')
				assert.ok(mongoose.Types.ObjectId.isValid(res._id), 'Response should contain a valid id')

				book_id = res._id

				done()

			})
      });
      
      test('Test POST /api/books with no title given', function(done) {

		chai
		  	.request(server)
		  	.keepOpen()
		  	.post('/api/books')
		  	.end((err, res) => {
				assert.equal(res.status, 200, 'Response status should be 200')

				assert.strictEqual(res.body, 'missing required field title', 'Response should be "missing required field title"')

				done()		

      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){

		chai
		  	.request(server)
		  	.keepOpen()
		  	.get('/api/books')
		  	.end((err, res) => {
				assert.equal(res.status, 200, 'Response status should be 200')
				assert.isArray(res.body, 'Response should be an array')

	        	assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
   	     		assert.property(res.body[0], 'title', 'Books in array should contain title');
        		assert.property(res.body[0], '_id', 'Books in array should contain _id');
 
				done()		

    	  	});	  	

      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){

		chai
		  	.request(server)
		  	.keepOpen()
		  	.get('/api/books/00000000000000000000000')
		  	.end((err, res) => {
				assert.equal(res.status, 200, 'Response status should be 200')
				assert.strictEqual(res.body, 'no book exists', 'Response should be "no book exists"')

				done()		

    	  	});

      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){

		chai
		  	.request(server)
		  	.keepOpen()
		  	.get(`/api/books/${book_id}`)
		  	.end((err, res) => {
				assert.equal(res.status, 200, 'Response status should be 200')
				assert.strictEqual(typeof res.body, 'object', 'Response should be an object')

	        	assert.equal(res.body.comment_count, 0, 'Books in array should contain the correct commentcount');
   	     		assert.equal(res.body.title, 'Berserk', 'Books in array should contain the correct title');
        		assert.equal(res.body._id, book_id, 'Books in array should contain the correct _id');
 
				done()		

    	  	});

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
