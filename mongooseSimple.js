'use strict';

// A Mongoose script connecting to a MongoDB database given a MongoDB Connection URI.
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
 var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
// Mongoose uses a different connection string format than MongoDB's standard.
// Use the mongodb-uri library to help you convert
var mongodbUri = 'mongodb://georgette:Password123@ds034348.mongolab.com:34348/georgette_was_here';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connection error:'));

db.once('open', function callback () {
  // Create schema
  var fishSchema = mongoose.Schema({
    name: String,
    sex: String,
    size: Number
  });

  // Store fish documents in a collection called "fishCollection"
  var Fish = mongoose.model('fishCollection', fishSchema);

  // Create seed data
  var georgette = new Fish({
    name: 'Georgette',
    sex: 'female',
    size: 5,
  });
 
  var george = new Fish({
    name: 'George',
    sex: 'male',
    size: 4.5,
  });  

  var spot = new Fish({
    name: 'Spottie Son',
    sex: 'male',
    size: 4.5,
  });  

  var jeauc = new Fish({
    name: 'Jeauc',
    sex: 'male',
    size: 5.0,
  });  
  
  var newbie = new Fish({
    name: 'Newbie',
    sex: 'unknown',
    size: 1,
  })
  
  // save/add the docs. The collection is created automatically when we insert the first doc.
  // georgette.save();
  // george.save();
  // spot.save();
  // jeauc.save();
  // newbie.save();

  // Update jeauc, he's grown 0.25
  //Song.update({ song: 'One Sweet Day'}, { $set: { artist: 'Mariah Carey'} }, 
  Fish.update({ fish: 'jeauc'}, { $set: { size: 5.25 } }, 
    function (err, numberAffected, raw) {
      if (err) return handleError(err);
  
      // Query - returns fish with size gt 4.5
      Fish.find({ size: { $gt: 4.5} }).exec(function (err, docs){
        if (err) throw err;
        
        docs.forEach(function (doc) {
          console.log(
            'This fish is ' + doc['name'] + '; it\'s a ' + doc['sex'] + ' goldfish, ' + 
            'which is sized ' + doc['size'] + ' inches long.' 
          );
        });

        // clean up
        mongoose.connection.db.collection('fishCollection').drop(function (err) {
          if(err) throw err;
          // Only close the connection when your app is terminating
          mongoose.connection.db.close(function (err) {
            if(err) throw err;
          });
        });
        
      });
      
    } // end function
  ) // end Fish.update

}); // end db.once
