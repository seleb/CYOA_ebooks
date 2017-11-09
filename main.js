var tweet = require('./cyoa.js')();
console.log(tweet);

var Twitter = require('twitter');
 
var client = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});

var params = {status: tweet};
client.post('statuses/update', params, function(error, tweets, response) {
	if (!error) {
		console.log(tweets);
	}
});