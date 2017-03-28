var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
//Setup for MongoDB
var mongodb = require('mongodb')
var mongoClient = mongodb.MongoClient
var mongoose = require('mongoose')
var Schema = mongoose.Schema

//mongoose information/schema etc.
var CounterSchema = Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0 }
})
var counter = mongoose.model('counter', CounterSchema)
var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
})


var url = 'mongodb://testuser:test@ds141450.mlab.com:41450/url_shortener'

var port = process.env.PORT || 8080
var regex = /http:\/\/www\.\w+\./g
var errorText = 'Please use a proper web address format (Ex: HTTP://www.example.com)'

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/*
mongoClient.connect(url, function(err, db) {
  if (err) { console.log('Unable to connect to the mongodb server. Error: ', err) }
  else {
    console.log('connection established to', url)
    db.collection('shorturl').find({'user': 'test'}).toArray(function(err, res){
      if (err) { console.log(err) } 
      else if (res.length) {
        console.log('Found:', res)
      }
      else {
        console.log('No documents found with defined "find" criteria!')
      }
    })
    db.close()
  }
})
*/

app.get('/', function(req, res){
  console.log(process.env.MONGOLAB_URI)
  //res.redirect('/api/replace')
  res.sendFile(path.join(__dirname, 'views/index.html'))
})
app.get(/^\/api\/./, (req, res) => {
  var addUrl = req.url.slice(5).toString()
  var listedInfo
  function callback(info) {
    var display = { "original_url":info.url,"short_url":"https://fcc-projects-tbwilson.c9users.io/"+info._id }
    res.send(display)
  }
  if (regex.test(addUrl)){
    mongoClient.connect(url, function(err, db){
      if(err){console.log(err)}
      else {
        db.collection('shorturl').find({'url': addUrl}).toArray(function(err, res){
          if (err) {console.log(err)}
          else if (res.length) {
            console.log("FOUND IT!: ", res[0])
            listedInfo = res[0]
            db.close(callback(listedInfo))
          } else {
            var newId = 1000;
            db.collection('shorturl').find({}).toArray(function(err, res){
              if(err){console.log(err)}
              newId += res.length
              db.collection('shorturl').insert({ '_id': newId, 'url': addUrl}, function(err, res){
                if(err){console.log(err)}
                else{
                  console.log('inserted documents', res)
                  listedInfo = res.ops[0]
                  db.close(callback(listedInfo))
                }
              })
            })
          }
        })
      }
    })
  } else {
    res.send('Please use proper HTTP formatting and try again!')
  }
})
app.get('/:data', (req, res) => {
  console.log(req.params.data)
  var findId = req.params.data
  function callback(info){
    if(info === false){
      res.send('The address you are attempting to use is not correct, please try again.')
    } else {
      var newUrl = info.url.replace("'", '')
      //window.location = 'www.mabankisd.net'
      res.redirect(info.url)
    }
  }
  mongoClient.connect(url, function(err, db){
    if(err){console.log(err)}
    else {
      console.log(req.params.data)
      db.collection('shorturl').find({"_id":Number(req.params.data)}).toArray(function(err, res){
        if(err){console.log(err)}
        else if (res.length) {
          console.log(res[0])
          db.close(callback(res[0]))
        } else {
          console.log(res)
          db.close(callback(false))
        }
      })
    }
  })
})

//attempting to use POST instead of GET through the index.html page.
app.post('/test/shorten', (req, res) => {
  console.log('POST received!')
  var longUrl = req.body.url;
  var shortURL = '';
})
/*
app.post(/^\/new\/./, (req, res) => {
  console.log('Post works')
  var addUrl = req.url.slice(5).toString()
  var sendFile = {  }
  if(regex.test(addUrl)){
    sendFile.Url = addUrl;
    mongoClient.connect(url, function(err, db) {
    if(err){console.log('Unable to connect to the mongodb server. Error:', err) }
      else {
        db.collection('shorturl').insert({'url': 'does it work?'}, function(err, res){
          if(err){console.log(err)}
          else {
            console.log('inserted documents into the shorturl collection. Documents inserted include:', res.length, res)
          }
        })
      }
    })
    res.send(sendFile)
    console.log('This URL is good!')
  } else {
    sendFile.error = errorText
    res.send(sendFile)
  }
  console.log(addUrl)
  //res.send('testing page')
})
*/


app.listen(port, () => {
    console.log("Application is listening on " + port)
})