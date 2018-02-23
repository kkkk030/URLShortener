var express = require('express');
var mongoose = require('mongoose');
var bijective = require('./bijective.js');
var Urls = require('./models');
var c=0;
mongoose.connect('mongodb://localhost/url-shortener');

var app = express();
app.use(express.static('public'));

//-----------------------------------url 받기---------------------------
app.get('/url/:longUrl', function(req, res){
  var shortUrl = '';
  Urls.findOne({url: req.params.longUrl}, function (err, doc){
    if (doc){
      console.log(req.params.longUrl);
      res.send({'key': bijective.encode(doc._id)});
    } else
    {
        var newUrl = Urls({
        url: req.params.longUrl
      });
      newUrl.save(function(err) {
        if (err) console.log(err);
        res.send({'key': bijective.encode(newUrl._id)});
      });
    }
  });
});

//-----------------------------check-------------------------------

app.get('/check/:cUrl', function(req, res){
  var cheUrl = '';
  Urls.findOne({url: req.params.cUrl}, function (err, doc){
    console.log(req.params.cUrl);
    if (doc){
      res.send({'count': doc.count});
      console.log(doc.count);
    }
  });
});

app.get('/:key', function(req, res){

  var id = bijective.decode(req.params.key);

  Urls.findOneAndUpdate({_id: id}, {$inc: {count: 1} }, {upsert: true}, function (err, doc){
    if (doc) {
      console.log("shortenurl 접속 횟수: ");
      console.log(doc.count);
      res.redirect(doc.url);
    } else {
      res.redirect("/");
    }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
