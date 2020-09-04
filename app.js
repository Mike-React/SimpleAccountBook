var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/myaction', function(req, res) {
    var fs = require('fs');
    var csvWriter = require('csv-write-stream');

    var writer = csvWriter({sendHeaders: false})
    writer.pipe(fs.createWriteStream('bill.csv', {flags: 'a'}));
    writer.write({type: req.body.type, time: Date.parse(req.body.time), category: req.body.category, amount: req.body.amount});
    writer.end();
    res.status(204).send();
});

app.listen(8080, function() {
    console.log('Server running at http://54.144.240.214:8080/');
});