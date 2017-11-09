var j = ``;

j = j.replace(/\n/g,' '); // strip newlines
j = j.replace(/ tum /g, ' turn '); // fix common errors
j = j.replace(/ It' /g, ' It\'s '); // fix common errors
j = j.replace(/'/g, '\\\''); // fix single quotes

j = j.match(/If .*?\.|Turn .*?\./g);
//j = j.match(/If .*? page \d*\.|Turn .*? page \d*\./g); // match page choices + directions

// output
s = '';
for(var i = 0; i < j.length; ++i){
s += "'" + j[i] + "',\n";
}
console.log(s);