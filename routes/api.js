/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')
const Book = require('../model/Book')
const express = require('express')

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
	
		try {
			const books = await Book.find({}, '_id title commentcount')
			
			return res.status(200).json(books)
		} catch (err) {
			return res.status(500).send('server error')
		}
    })
    
    .post(async (req, res) => {
      	let title = req.body.title;
      	//response will contain new book object including atleast _id and title
		//
		if (!title) {
			return res.send('missing required field title')
		}
		
		const book = await Book.create({ title: title })

		return res.json(book)
    })
    
    .delete(async(req, res) => {
      	//if successful response will be 'complete delete successful'
		
		try {
			await Book.deleteMany()

			return res.status(200).send('complete delete successful')

		} catch (err) {
			return res.json({result: 'error delete the files', error: err})
		}

    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

		try {
			let book = await Book.findOne({_id: bookid})

			if (!book) {
				return res.send('no book exists')
			}

			return res.status(200).json(book)

		} catch (err) {

			return res.status(500).send('no book exists')

		}

    })
    
    .post(async (req, res) => {
      	let bookid = req.params.id;
      	let comment = req.body.comment;
      //json res format same as .get
		
		if (!comment) {
			return res.send('missing required field comment')
		}

		try {
			let book = await Book.findOneAndUpdate({_id: bookid}, { $push: {comments: comment} }, { new: true} )
			
			if (!book) {
				return res.send('no book exists')
			}

			return res.status(200).json(book)

		} catch {
			return res.send('no book exists')
		}
    })
    
    .delete(async(req, res) => {
        let bookid = req.params.id;
        //if successful response will be 'delete successful'

		try {
			let book = await Book.findOneAndDelete({_id: bookid});

			if (!book) {
				return res.send('no book exists')
			}

			return res.send('delete successful')

		} catch {

			return res.status(500).send('server error')
			
		}
    });
  
};
