var express = require('express');
var evalin = require('evalin');

var app = express();

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

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port', port);
});
