function Ngram(__string, __order) {
	this.string = __string;
	this.occurences = 0;
	this.next = {};
	this.order = __order;
}

Ngram.prototype.getNext = function(){
	var r = Math.random();
	var t;
	for(var i = 0; i < this.thresholds.length; ++i){
		t = this.thresholds[i];
		if(r <= t.p){
			return t.next.next.string[t.next.next.string.length-1];
		}
	}
	return '';
};

function Markov(__options) {
	this.delim = __options.delimeter || '';
	this.source = Array.isArray(__options.source) ? __options.source : [__options.source];
	this.ngrams = {};
	this.minOrder = isNaN(__options.minOrder) ? 2 : __options.minOrder;
	this.maxOrder = isNaN(__options.maxOrder) ? 4 : __options.maxOrder;
	
	for(var source = 0; source < this.source.length; ++source){
		var s = this.source[source].split(this.delim);
		for ( var o = this.minOrder; o <= this.maxOrder; ++o){

			var prev;
			for(var i = 0; i < s.length-o+1; ++i){
				var w = s.slice(i,i+o);
				var hash = w.join(this.delim);
				var ngram = this.ngrams[hash] = this.ngrams[hash] || new Ngram(w, o);
				ngram.occurences += 1;
				if(i === 0){
					ngram.start = true;
				}

				if(prev){
					var c = ngram.string[ngram.string.length-1];
					var next = prev.next[c] = prev.next[c] || {
						next: ngram,
						occurences: 0
					};
					next.occurences += 1;
				}

				prev = ngram;
			}
		}
	}

	for(var n in this.ngrams){
		if(this.ngrams.hasOwnProperty(n)){
			var ngram = this.ngrams[n];
			ngram.thresholds = [];
			for(var i in ngram.next){
				if(ngram.next.hasOwnProperty(i)){
					var next = ngram.next[i];
					ngram.thresholds.push({
						next: next,
						p: next.occurences/ngram.occurences
					});
				}
			}
			ngram.thresholds.sort(this.sort);
			var t = 0;
			for(var i=0; i < ngram.thresholds.length; ++i){
				t += ngram.thresholds[i].p;
				ngram.thresholds[i].p = t;
			}
		}
	}
	this.keys = Object.keys(this.ngrams);
	this.startKeys = [];
	for(var i = 0; i < this.keys.length; ++i){
		var k = this.keys[i];
		if(this.ngrams[k].start === true){
			this.startKeys.push(k);
		}
	}

	//console.log(this);
}

Markov.prototype.randomNgram = function(){
	return this.ngrams[
		this.keys[
			Math.floor(Math.random()*this.keys.length)
		]
	];
};
Markov.prototype.randomStartNgram = function(){
	return this.ngrams[
		this.startKeys[
			Math.floor(Math.random()*this.startKeys.length)
		]
	];
};

Markov.untilMaxLength = function(__maxLength, __string){
	return (__string.join(this.delim).length >= __maxLength);
};
Markov.until = function(__seachString, __string){
	var s = __string[__string.length-1];
	var i = s.indexOf(__seachString);
	if(i > -1){
		__string[__string.length-1] = s.substr(0,i+__seachString.length);
		return true;
	}
	return false;
};

Markov.prototype.randomSequence = function(__start, __until) {
	var s = __start ? __start.split(this.delim) : this.randomStartNgram().string;
	var n;
	var o;
	var orders = [];
	var hash;

	var until;
	if(typeof __until !== "function"){
		if(__until === undefined){
			throw 'An `__until` has to be provided';
		}
		until = Markov.untilMaxLength.bind(undefined, __until);
	}else{
		until = __until;
	}

	for(var i = this.minOrder; i <= this.maxOrder; ++i){
		orders.push(i);
	}
	while(!until(s)){
		var orderAttempts = orders.slice();
		do{
			o = Math.floor(Math.random()*orderAttempts.length);
			o = orderAttempts.splice(o,1)[0];
			hash = s.slice(-o);
			n = this.ngrams[hash.join(this.delim)];
		}while(!n && orderAttempts.length > 0);

		if(!n){
			console.warn('No ngram for', s.slice(-this.maxOrder));
			n = this.randomNgram();
		}
		
		var next = n.getNext();
		if(!next){
			console.warn('No next for ', n);
			next = '\0';
		}
		s = s.concat(next);
	}
	return s.join(this.delim);
};

Markov.sort = function(__a,__b){
	return __a.p - __b.p;
};

var exports = module.exports = Markov;