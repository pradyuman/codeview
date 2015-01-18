var express = require('express');
var evalin = require('evalin');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codeview');

var User = mongoose.model('User', new mongoose.Schema({
  name: String,
  password: String // yolo
}));

var app = express();

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/public'));

app.post('/execute', function(req, res) {
  var code = req.body.code;
  var lang = req.body.lang;

  if (!code) {
    return res.json({
      error: 'No code given.'
    });
  }

  if (!lang) {
    return res.json({
      error: 'No language specified.'
    });
  }

  evalin(code, lang).then(function(data) {
    return res.json(data);
  }).catch(function(e) {
    return res.json({
      error: 'Error evaluating code: ' + e.toString()
    });
  })

});

app.get('/langs', function(req, res) {
  res.json(evalin.langs);
});

app.get('/api/leaderboard', function(req, res) {
  res.json([{
    name: 'dandiferr',
    elo: 2520
  }, {
    name: 'wyndwarrior',
    elo: 2339
  }, {
    name: 'aahanemia',
    elo: 1859
  }, {
    name: 'sindresorhus',
    elo: 1193
  }, {
    name: 'tj',
    elo: 1530
  }, {
    name: 'xX_4sun4_Xx',
    elo: 1930
  }, {
    name: 'amandatru',
    elo: 865
  }, {
    name: 'simplyianm',
    elo: 1720
  }, {
    name: 'Scyphi',
    elo: 2300
  }, {
    name: 'sorbetman',
    elo: 1550
  }, {
    name: 'tejasmanohar',
    elo: 1440
  }, ]);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port', port);
});
