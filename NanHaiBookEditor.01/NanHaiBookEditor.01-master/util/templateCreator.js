var cheerio = require('cheerio'),
    fs = require('fs');

fs.readFile('from.html', 'utf8', dataLoaded);

function dataLoaded(err, data) {
	console.log(data);
    $ = cheerio.load(data);
    //console.log($('h1')[0].attribs);
    $("*").each(function(i, elm) {
    	let $this = $(this);
    	let attribs = $this[0].attribs;
    	for(let attr in attribs){
    		if(attr !=="style"){
    			$this.removeAttr(attr);
    		}
    	}
    });
    let content = $.html();
    console.log(content);
    fs.writeFile("./output.html", content, function(){});
}