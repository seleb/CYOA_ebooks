Markov = require('./markov.js');
corpus = require('./corpus.js');



markov = new Markov({
	source: corpus,
	minOrder:2,
	maxOrder:9,
	delimeter: ''
});
var tweet = markov.randomSequence(undefined, Markov.until.bind(undefined, '\0'));

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