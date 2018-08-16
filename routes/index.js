var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('index.html', { root:  'public' });
});

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); // Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/crossyBlockDB'); // Connects to a mongo database called "crossyBlockDB"

var scoreSchema = mongoose.Schema({ // Defines the Score Schema for this database
	Username: String,
	Score: Number,
	DateRecorded: Date,
});

var Score = mongoose.model('Score', scoreSchema); // Makes an object from that schema as a model

var db = mongoose.connection; // Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); // Checks for connection errors
db.once('open', function() { // Lets us know when we're connected
	console.log('Connected to database');
});

/* POST a score */
router.post('/addscore', function(req, res, next) {
	if (req && req.body && (!req.body.Username || !req.body.Score)) {
		return res.status(400).json({ error: 'Required fields are missing' });
	}
	var newScore = new Score({
		...req.body,
		DateRecorded: new Date(),
	});
	newScore.save(true, function(err, post) {
    	if (err) return console.error(err);
    	return res.sendStatus(200);
	});
});

/* GET high scores */
router.get('/getHighScores', function(req, res, next) {
	var query = Score.find().limit(10).select({ Username: 1, Score: 1 }).sort({ Score: -1, DateRecorded: -1 });
	query.exec(function(err,scores) {
		if (err) return console.error(err);
	    return res.json(scores);
	});
});

module.exports = router;
