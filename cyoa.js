Markov = require('./markov.js');
corpus = require('./corpus.js');

markov1 = new Markov({
	source: corpus,
	minOrder:4,
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
	var s = (Math.random() < 0.5 ? markov1 : markov2).randomSequence(undefined, Markov.until.bind(undefined, '\0'));

	// remove null + trim
	s = s.substr(0,s.length-1);
	s = s.trim();	

	// fix mismatched quotation marks
	if((s.match(/"/g) || []).length % 2 == 1){
		if(s.match(/page \d*\.$/)){
			s = s.split(/\s*(?=page \d*\.$)/);
			s.splice(-1,0,'," ');
			s = s.join('');
		}
	}

	// start with caps
	s = s.substr(0,1).toUpperCase() + s.substr(1);

	// end with period
	if(s.substr(-1) != "."){
		s += ".";
	}

	return s;
};