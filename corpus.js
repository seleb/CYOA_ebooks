var exports = module.exports = (function(){
var corpus = [
];
for(var i = 0; i < corpus.length; ++i){
    corpus[i] += "\0";
}
return corpus;
}());
