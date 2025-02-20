var express = require('express'),
	app = express(),
	cors = require('cors'),
	compression = require('compression');

app.use(compression());
app.use(cors());

app.get('/', function (req, res) {
	res.sendFile('index.html', { root: './client' });
});

app.use(express.static('./client'));

app.use(express.json({ limit: '5000000mb' }));
app.use(express.urlencoded({ extended: true, limit: '5000000mb' }));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

module.exports = app;
