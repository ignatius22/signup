const express = require('express');

const path =require('path');

const mongoose=require('mongoose');

const bodyParser = require('body-parser');



mongoose.connect('mongodb://localhost/nodekb');

let db = mongoose.connection;

//check connection
db.once('open', function(){
    console.log('conectected to MongoDB');
});


//check for DB Errors

db.on('error', function(err){
    console.log(err);
});


//init app
const app = express();


//bring in models

let Article = require('./models/article');

//load engine views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
//parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())


// set public folder
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', function (req, res){

    Article.find({}, function(err, articles){

        if(err){
            console.log(err);
        }

        else{
            res.render('index', {
                title:'Articles', 
              articles: articles}
              );
        }
      });

    });



 //get single article

 app.get('/article/:id', function (req, res){
     Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article:article
        });
      });

     });
  



//Add route
app.get('/articles/add', function (req, res){
    res.render('add_article', {
        title:'Add Article'});
  });

// Add submit POST Route
app.post('/articles/add', function (req, res){

  let article = new Article();
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;


   article.save(function(err){
       if(err){
           console.log(err);
           return;
       } else{
           res.redirect('/');
       }
   });

    
  });


// load Edit form

app.get('/articles/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
       res.render('edit_article', {
           title:'Edit Article',
           article:article
       });
     });

    });
 







app.post('/articles/edit/:id', function (req, res){
  let article = {};
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

  let query = {_id:req.params.id};


   


   Article.update(query,article, function(err){
       if(err){
           console.log(err);
           return;
       } else{
           res.redirect('/');
       }
   });

    
  });


//start server
app.listen(3000, function(){
    console.log('listening to port 3000...');
});