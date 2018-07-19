const graphql = require("graphql");
const {find, filter} = require("lodash");
// adding the models
const Book = require("../models/book");
const Author = require("../models/author");

const {
        GraphQLObjectType,
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLList,
        GraphQLNonNull
      } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
         author: {
            type: AuthorType,
            resolve(parent, args){ 
             //  return find(authors, { id: parent.authorId} );   
             return Author.findById(parent.authorId); 
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString },
        age: {type: GraphQLString },
        books:{
           type: new GraphQLList(BookType),
           resolve(parent, args){
             //  return filter(books, {authorId: parent.id});
             return Book.find({ authorId: parent.id });
           }

        }
    })
});

// create a root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}} ,
            resolve(parent, args){
             // code to get data from db or other source
              //  return find(books, {id: args.id});
              return Book.findById(args.id);
             }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
              // return find(authors, {id: args.id}); 
              return Author.findById(args.id);
            }
        },
        books:{ // get all list of books
            type: new GraphQLList(BookType),
            resolve(parent, args){
              //  return books;
              return Book.find({});
            }
        },
        authors:{ // get a all list of authors
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
               // return authors;
               return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
 name: "Mutation",
 fields: {
   addAuthor: {
       type: AuthorType,
       args:{
           name: { type: new GraphQLNonNull(GraphQLString) },
           age: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args){
            let author = new Author({
             name: args.name,
             age: args.age
            });
          // saving and return the object  
          return author.save();  
        }
    },
    addBook: {
        type: BookType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            genre:{ type: new GraphQLNonNull(GraphQLString)},
            authorId: { type: new GraphQLNonNull(GraphQLString)}
        },

        resolve(parent, args){
           let book = new Book({
               name: args.name,
               genre: args.genre,
               authorId: args.authorId
           }); 
        // saving and return the object 
           return book.save();
        }
    },
    editBook: {
      type: BookType,
      args: {
        id: {type: GraphQLID},
        name: { type: GraphQLString },
        genre:{ type: GraphQLString },
        authorId: { type: GraphQLString }
      },
      resolve(parent, args){
        // updating and return the object 
        return Book.findByIdAndUpdate(
            args.id,
            { $set: { 
                name: args.name,
                genre: args.genre,
                authorId: args.authorId
               }
             },
            { new: true }
          )
      }

    },
    deleteBook: {
        type: BookType,
        args: {
            id: {type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args){
         return Book.findByIdAndRemove(args.id).exec();
        }
    }

  }

});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});