const mongoose = require("mongoose");
/*
const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String
});
*/
const bookSchema = mongoose.Schema({
  name : {type: String , required:true},
  genre: {type:String , required: true},
  authorId: {type: String , required: true}
});

module.exports = mongoose.model('Book', bookSchema);