var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');

function merge(a,b){
	var i=0, j=0;
	var all = [];
	var len1 = a.length, len2 = b.length;
	var index = 0;
	if(len1 == 0){
		// console.log(a.concat(b));
		all = all.concat(b);
	}else if(len2 == 0){
		all = all.concat(a);
	}else{
		while(i< len1 && j< len2){
			if(a[i].ecstasy >= b[j].ecstasy){
				all[index] = a[i];
				i++;
			}else{
				all[index] = b[j];
				j++;
			}
			index++;
		}

		while(i<len1){
			all[index] = a[i];
			i++;
			index++;
		}

		while(j<len2){
			all[index] = b[i];
			j++;
			index++;
		}
	}
	return all;
}

/* GET home page. */
router.get('/hotels/search', function(req, res, next) {

	var providers = ['Expedia', 'Orbitz', 'Priceline', 'Travelocity', 'Hilton'];
	var results = [];
	var scraperFarm = "http://localhost:9000/scrapers/";

	// Asynchronously GET all the results from each provider
	async.each(providers, 
		function(provider, callback){
			var scraper = scraperFarm + provider;
			http.get(scraper, function(resp){
					resp.on('data', function(chunk){
						// append to results array
						results = merge(results, JSON.parse(chunk).results);
						// results = results.concat(JSON.parse(chunk).results);
					});
					resp.on('end', function(){
						callback();
					})
			});
			
		}, 
		function(err){
			if(err){
				res.send(err);
			}
			// sort the results with descending ecstasy
			// results.sort(function(a,b){
			// 	return b.ecstasy - a.ecstasy;
			// });
			// send results as requested
			res.send({"results":results});
		});

});

module.exports = router;
