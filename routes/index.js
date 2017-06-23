var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');

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
						results = results.concat(JSON.parse(chunk).results);
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
			results.sort(function(a,b){
				return b.ecstasy - a.ecstasy;
			});
			// send results as requested
			res.send({"results":results});
		});

});

module.exports = router;
