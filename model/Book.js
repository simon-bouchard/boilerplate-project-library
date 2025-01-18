const mongoose = require('mongoose');
  
const bookSchema = new mongoose.Schema({
	title: {required: true, type: String},
    comments: {default: [], type: [String]},
	commentcount: {type: Number, default: 0}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
