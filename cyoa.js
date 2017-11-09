Markov = require('./markov.js');
corpus = require('./corpus.js');

markov = new Markov({
	source: corpus,
	minOrder:2,
	maxOrder:9,
	delimeter: ''
});

exports = module.exports = function(){
	return markov.randomSequence(undefined, Markov.until.bind(undefined, '\0'))
};