var express = require('express');
var evalin = require('evalin');
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
    elo: 2520,
    rating: 19
  }, {
    name: 'wyndwarrior',
    elo: 2339,
    rating: -39
  }, {
    name: 'aahanemia',
    elo: 1859,
    rating: 100
  }, {
    name: 'sindresorhus',
    elo: 1193,
    rating: 28
  }, {
    name: 'tj',
    elo: 1530,
    rating: 23
  }, {
    name: 'xX_4sun4_Xx',
    elo: 1930,
    rating: 23
  }, {
    name: 'amandatru',
    elo: 865,
    rating: -3
  }, {
    name: 'simplyianm',
    elo: 1720,
    rating: 9
  }, {
    name: 'Scyphi',
    elo: 2300,
    rating: 7
  }, {
    name: 'sorbetman',
    elo: 1550,
    rating: 4
  }, {
    name: 'tejasmanohar',
    elo: 1440,
    rating: 1
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
