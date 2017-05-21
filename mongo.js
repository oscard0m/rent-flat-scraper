var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectID;
// var assert = require('assert');



MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
  console.log("Connected correctly to server " + db.databaseName);

  var col = db.collection('flat');

  col.findOne({}, function(err, doc) {
	console.log(doc.name);
	db.close();
  });
	// col.deleteMany({"a" : 1}, function(err, r) {
	// 	assert.equal(null, err);
	// 	db.close();
	// });
});