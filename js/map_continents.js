function map_continents (element, dataset, year){
	if (element.clientWidth <=0 ) return;
	var margin = {top: 12, right: 30, bottom: 10, left: 55},
    	width = element.clientWidth - margin.left - margin.right,
    	height = element.clientWidth/1.8 - margin.top - margin.bottom;

	var projection = d3.geo.kavrayskiy7(),
	    color = d3.scale.category20(),
	    graticule = d3.geo.graticule();

	var path = d3.geo.path()
	    .projection(projection);

	var svg = d3.select(element).append("svg")
	    .attr("width", width)
	    .attr("height", height);

  queue()
    .defer(d3.json, "js/readme-world.json")
    .defer(d3.json, "js/medalhas_mapas.json")
	.await(ready);	
			
	var zoom = d3.behavior.zoom().scaleExtent([1.0, 8]).on("zoom", zoomed);
	    svg.call(zoom);

	function zoomed() {
	    svg.selectAll(".country").attr("transform",
	        "translate(" + zoom.translate() + ")" +
	        "scale(" + zoom.scale() + ")"
	    );
	}

	console.log(medalhas.filter(function (x) { 
		return parseFloat(x.ID) == parseFloat(736);}
	));
	var num_medalhas = d3.map();
	var num_medalhas_max = 0;
	var continents = d3.map();
	
	function ready(error, world, medalhasData) {

	  var selected_year = medalhas.filter(function (x) { 
		  return x.Olympics == year;
	   });
	  var medalhasData = {data:selected_year};	
	  
	  var nested = d3.nest().key( function(d) {
	    return d.Continent;
	  }).entries(medalhasData.data)

	  //console.log(nested)

	  //console.log( nested);
	  for (i in nested) {
	  	x = nested[i].values.length;
	    num_medalhas.set(nested[i].key, x);
	    if (x > num_medalhas_max) num_medalhas_max = x;
	  }
	  
	  var data_continents = [];
	  for (i in num_medalhas) {
		  var obj = {};
		  obj["Continent"] = i;
		  obj["Medalhas"] = num_medalhas[i];
		  data_continents.push(obj);
	  }	  
		  
	  //console.log(data_continents)
		  
	  //console.log(data_continents.filter(function (x) { 
		//  return x.Continent.localeCompare("Europe") == 0;
	  //})[0].Medalhas);
		  
	  var countries = topojson.feature(world, world.objects.countries).features,
	      neighbors = topojson.neighbors(world.objects.countries.geometries);



		var tip = d3.tip()
			.attr('class', 'd3-tip')
		    .offset([-20, 40])
		    .html(function(d) {
				//console.log(d)
		    	//var cont = continents.get(d.id);
  	          	var cont = continents_dataset.filter(function (x) { 
  				  return parseFloat(x.ID) == parseFloat(d.id);
  			  	})
				console.log(cont[0].Continent)
		    	if (cont != undefined) {
					medalhas_cont = data_continents.filter(function (x) { 
						return x.Continent.localeCompare(cont[0].Continent) == 0;})[0].Medalhas
					///console.log(medalhas_cont);	
					
			    	return "<strong>Continent:</strong>" + " " + cont[0].Continent + 
						"<br>"  + "<strong>" + "Number of medals:</strong> " + medalhas_cont 

						 + "<br>"; 
				} else {
					return "";
				}
		});
		svg.call(tip);

	coef = 255 / Math.log(num_medalhas_max/20);
	  svg.selectAll(".country")
	      .data(countries)
	      .enter().insert("path", ".graticule")
	      //.attr("class", "country")
		  .attr("class", function(d) { 
			  var continent_name = continents_dataset.filter(function (x) { 
				  return parseFloat(x.ID) == parseFloat(d.id);
			  })
			  if (continent_name[0] == undefined) {
				  return "country country_" + d.id
			  } else {
				  return "country " + continent_name[0].Continent.replace(/\ /g, "_"); 
			  }			  
			 } )
		  .attr("d", path)
	      .style("fill", function(d, i) { 
			  //console.log(d)
			  //console.log(d.id)
			  var color = 0;
	          var cont = continents_dataset.filter(function (x) { 
				  return parseFloat(x.ID) == parseFloat(d.id);
			  })
			  
			  var n;
			  if (cont && cont.length > 0) {
				  cont = cont[0].Continent
				  n = data_continents.filter(function (x) { 
				  		return x.Continent.localeCompare(cont) == 0;
				  	})
				 if (n == undefined || n == 0) {
					 color = 255;
				 } else {
					 if (n[0].Medalhas == 0){
						 color = 255;
					 } else {		 
				 		color = parseInt(255 - coef * Math.log(n[0].Medalhas/20)); 
					 }
				}	 		
			}
	          return "rgb("+color+","+color+",255)";
	      })
	      .on('mouseover', tip.show)
		  .on('mouseout', tip.hide)
	  }
};	