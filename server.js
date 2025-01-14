// import dependencies ( imports the express library )
const express = require('express')

// creats an instance of the express library / create a new express application object
const app = express()

// imports the MongoDB Client 
const MongoClient = require('mongodb').MongoClient

// sets the port for express to listen on
const PORT = 2121

// imports "dotenv" and runs the config method, which in turn loads the vars from ".env"
require('dotenv').config()

// initialize variables for 'db' (no value), 'dbConnectionStr' ( mongoDB connection string from .env), 'dbName' (Mongodb collection 'todo')
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// initalize the connection to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

// handling a sucessfully resolved promise & printing to the console.log
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // assigning the connected client instance, attached to the the 'todo' collection to the 'db' variable
        db = client.db(dbName)
    })
// needed a catch error 
.catch(error => console.error(error))
    

// sets the 'ejs' as the rendering engine for the .render() method
app.set('view engine', 'ejs')

// serves 'public' folder contents as is
app.use(express.static('public'))
// middleware (intercepts requests and responses) - allows query data to be passed to server via request 
//(https://localhost/route?variable=value&othervariable=othervalue)
app.use(express.urlencoded({ extended: true }))
// middleware to load the json body parser for incoming requests.
app.use(express.json())

// defines a "get" method at the root fo the server.
app.get('/',async (request, response)=>{
    // request to mongo to return all records from "todos" collection, in an array.
    const todoItems = await db.collection('todos').find().toArray()
    // returns a count of the number of records with the "completed" field equal to false.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // express passes the data from the above two queries in to the ejs rendering engine - responds with html
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// POST method for recieving a new todo item
app.post('/addTodo', (request, response) => {
    // adds new todo item to the db, with the completed dield defaulted to false.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // handles returned promise, logs to the server console and redirects back to root page.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // logs an error to the console, if there is one. 
    .catch(error => console.error(error))
})

// defines an endpoint to handle a PUT request 
app.put('/markComplete', (request, response) => {
    // updates a record, using value recieved from "itemFromJS" in the body of the request
    db.collection('todos').updateOne(
        {thing: request.body.itemFromJS},
        // sets the "completed" field to true
        {
        $set: {
            completed: true
          }
    },
    // updates the newest document if multiple results. if no matches, don't create a new record. 
    {
        sort: {_id: -1},
        upsert: false
    })
    // if success, log and send response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // if no, log the error.
    .catch(error => console.error(error))

})
// does the opposite of the previous request 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// handles a DELETE request at the defind endpoint 
app.delete('/deleteItem', (request, response) => {
    // mongodb function to delete a single todo item
    db.collection('todos')
        .deleteOne({thing: request.body.itemFromJS})
        // if successful , log and send response
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // if it fails, log the error 
    .catch(error => console.error(error))

})
//  starts the server and waits for requests. 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})