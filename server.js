var express = require('express');
var P = require('bluebird');
var evalin = require('evalin');
var request = require('superagent');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeview');

var User = mongoose.model('User', new mongoose.Schema({
  name: String,
  password: String // yolo
}));

var app = express();

app.use(require('body-parser').json());
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Middleware to store the user
app.use(function(req, res, next) {
  if (!req.session.login) return next();
  User.findOne({
    name: req.session.login
  }, function(err, user) {
    req.user = user;
    next();
  });
});

app.post('/tip', function(req, res){
  var amount = req.body.amount;
  console.log(amount);
  return new P(function(resolve, reject) {
    request.get("http://api.reimaginebanking.com/customers/54b604dfa520e02948a0f3b3?key=ENTbdda3aaa6d74f154d6b9216792d77bc4").send({
        
      })
      .set('User-Agent', 'node-codeview')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function(res) {
        console.log(res);
        resolve(res.body);
      });
  }).then(function(data){
    return res.json(data);
  });
});

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

// Login
app.get('/api/user', function(req, res) {
  if (req.user) return res.json(user);
  return res.status(401).json({
    error: 'Not logged in'
  });
});

// Login.
app.post('/api/login', function(req, res) {
  var login = req.body.login;
  User.findOne({
    name: login
  }, function(err, user) {
    if (!user) return res.status(401).json({
      result: 'None'
    });

    req.session.login = req.body.login;
    res.json({
      result: 'Success'
    });

  });
});

// Register.
// TODO add password encryption
app.post('/api/register', function(req, res) {
  var user = new User({
    name: req.body.name,
    password: req.body.password
  });
  req.session.login = user.name;
  user.save(function() {
    res.json({
      result: 'Success'
    });
  });
});

app.post('/api/logreg', function(req, res) {
  var name = req.body.name;
  User.findOne({
    name: name
  }, function(err, user) {
    req.session.login = name;
    if (!user) {
      var ud = {
        name: req.body.name,
        password: req.body.password
      };
      var user = new User(ud);
      return user.save(function() {
        res.json(ud);
      });
    }

    res.json(user);

  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port', port);
});
