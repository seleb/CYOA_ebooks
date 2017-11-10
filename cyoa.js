Markov = require('./markov.js');
corpus = require('./corpus.js');

markov1 = new Markov({
	source: corpus,
	minOrder:2,
	maxOrder:10,
	delimeter: ''
});
markov2 = new Markov({
	source: corpus,
	minOrder:1,
	maxOrder:4,
	delimeter: ' '
});

exports = module.exports = function(){
	return (Math.random() < 0.5 ? markov1 : markov2).randomSequence(undefined, Markov.until.bind(undefined, '\0'))
};