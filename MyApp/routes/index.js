var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

/* GET home page. */
router.get('/location', function (req, res, next) {
  res.render('location');
});
router.post('/location/search', (req, res, next) => {
  const category = req.body.category;
  MongoClient.connect('mongodb://localhost:27017/sampleDB', (err, db) => {

    if (err) {
      //  console.dir(err);
      throw err;
    }
    const coord = [];
    coord.push(parseFloat(req.body.curLong));
    coord.push(parseFloat(req.body.curLat));
    const query = { 'category': req.body.category, 'location': { '$near': { '$geometry': { 'type': 'Point', 'coordinates': coord } } } };
    const projection = { '_id': 0, 'name': 1 };

    db.collection('places').createIndex([["location", '2dsphere']], (err, indexName) => {
      if (err)
        throw err;
      db.collection('places').find(query, projection).limit(3).toArray((err, docs) => {
        if (err)
          throw err;
        res.send(docs);
        db.close();
      });
    });

  });
});
router.post('/location/add', (req, res, next) => {
  console.dir(req.body);
  MongoClient.connect('mongodb://localhost:27017/sampleDB', (err, db) => {

    if (err) {
      //  console.dir(err);
      throw err;
    }
    const coord = [];
    coord.push(parseFloat(req.body.longitude));
    coord.push(parseFloat(req.body.latitude));
    const doc = { "name": req.body.name, "category": req.body.category, "location": coord };
    db.collection('places').insert(doc, (err, docInserted) => {
      res.send("success");
      db.close();
    });
  });
});

module.exports = router;
