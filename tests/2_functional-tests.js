const chaiHttp = require('chai-http');
const chai = require('chai');
const mongoose = require('mongoose');
const assert = chai.assert;
const server = require('../server');
const Book = require('../model/Book');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  const nonExistentId = mongoose.Types.ObjectId();
  let book_id;

  suite('Routing tests', function () {
    suite('POST /api/books with title => create book object/expect book object', function () {
      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'Berserk' })
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.isObject(res.body, 'Response should be an object');
            assert.equal(res.body.title, 'Berserk', 'Response title should match');
            assert.ok(
              mongoose.Types.ObjectId.isValid(res.body._id),
              'Response should contain a valid id'
            );

            book_id = res.body._id;
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'missing required field title', 'Response should match');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.isArray(res.body, 'Response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books should have commentcount');
            assert.property(res.body[0], 'title', 'Books should have title');
            assert.property(res.body[0], '_id', 'Books should have _id');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${nonExistentId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'no book exists', 'Response should match');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${book_id}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.isObject(res.body, 'Response should be an object');
            assert.equal(res.body.title, 'Berserk', 'Title should match');
            assert.equal(res.body._id, book_id, 'ID should match');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        chai
          .request(server)
          .post(`/api/books/${book_id}`)
          .send({ comment: 'A very joyful book' })
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.isObject(res.body, 'Response should be an object');
            assert.equal(res.body.title, 'Berserk', 'Title should match');
            assert.equal(res.body._id, book_id, 'ID should match');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.include(res.body.comments, 'A very joyful book', 'Comment should be included');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .post(`/api/books/${book_id}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'missing required field comment', 'Response should match');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post(`/api/books/${nonExistentId}`)
          .send({ comment: 'A very joyful book' })
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'no book exists', 'Response should match');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${book_id}`)
          .end(async (err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'delete successful', 'Response should match');

            const book = await Book.findById(book_id);
            assert.isNull(book, 'Book should be deleted from the database');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${nonExistentId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.text, 'no book exists', 'Response should match');
            done();
          });
      });
    });
  });
});
