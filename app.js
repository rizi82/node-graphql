const express   = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require('cors');

// connection to db
mongoose.connect("mongodb://rizi:rizi1234@ds261470.mlab.com:61470/graphql-books");
mongoose.connection.once("open", () => {
 console.log("Connected to database");
});

const app =  express();
// Access-Control-Allow-Origin
app.use(cors());

app.use('/graphql', graphqlHTTP({
 schema,
 graphiql: true

}));

// listen to port
app.listen(4000, () =>
{
    console.log("Now listing the request at port 4000\n");
});