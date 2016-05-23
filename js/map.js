function map (element, dataset, year){
	console.log(element.clientWidth )
	
	if (element.clientWidth <=0 ) return;
	var margin = {top: 12, right: 30, bottom: 10, left: 55},
		width = element.clientWidth - margin.left - margin.right,
		height = element.clientWidth/1.8 - margin.top - margin.bottom;

	var projection = d3.geo.kavrayskiy7(),
	    color = d3.scale.category20(),
	    graticule = d3.geo.graticule();

	var path = d3.geo.path()
	    .projection(projection);


	//console.log(height)
	//console.log(width)
	var svg = d3.select(element).append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var map_tip = d3.tip()
		.attr('class', 'd3-tip')
	    .offset([0, 0])
	    .html(function(d) {
	    	var pais = medalhas.filter( function(dd) {
	    		return dd.ID == d.id;
	    	});
	    	if (pais.length > 0) {
		    	return "<strong>Country:</strong>" + " " + pais[0].Country + 
					"<br>"  + "<strong>" + "Number of medals:</strong> " + 
					num_medalhas.get(d.id) + "<br>"; 
			} else {
				return "";
			}
	});
	svg.call(map_tip);
	                 // set the opacity to nil

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



	var num_medalhas = d3.map();
	var num_medalhas_max = 0;

	function ready(error, world, medalhasData) {

	  var selected_year = medalhasData.data.filter(function (x) { 
		  return x.Olympics == year;
	   });
	  var medalhasData = {data:selected_year};	 
  
	  var nested = d3.nest().key( function(d) {
	    return d.ID;
	  }).entries(medalhasData.data)


	  var country_and_id = [];
	  var nested_country = d3.nest().key( function(d) {
	    return d.Country;
	  }).entries(medalhasData.data)
  	  
	  for (item in nested_country){
		  var obj = {};
		  obj["id"] = nested_country[item].values[0].ID;
		  obj["Country"] = nested_country[item].key;
		  country_and_id.push(obj);
	  };
  
  
 

	  //console.log( nested);
	  for (i in nested) {
	  	x = nested[i].values.length;
	    num_medalhas.set(nested[i].key, x);
	    if (x > num_medalhas_max) num_medalhas_max = x;
	  }
  
  
	  var countries = topojson.feature(world, world.objects.countries).features,
	      neighbors = topojson.neighbors(world.objects.countries.geometries);

	  coef = 255 / Math.log(num_medalhas_max);

	  svg.selectAll(".country")
	      .data(countries)
	      .enter().insert("path", ".graticule")
	      //.attr("class", "country")	  
		  .attr("class", function(d) { 
			  var country_name = country_and_id.filter(function(x) {
		        return x.id == d.id;
		      });	
			  if (country_name[0] == undefined) {
				  return "country country_" + d.id
			  } else {
				  return "country " + country_name[0].Country.replace(/\ /g, "_"); 
			  }			  
			 } )
		  .attr("d", path)
	      .style("fill", function(d, i) { 
	          var color = 0;
	          var n = num_medalhas.get(d.id);
			  //console.log(n);
	          if (n == undefined) color = 255;
	          else color = parseInt(255 - 30 * Math.log(n));
	          /*
	          else if (n > 0 && n <= 50) color = 200;
	          else if (n > 50 && n <= 100) color = 180;
	          else if (n > 100 && n <= 150) color = 160;
	          */
			  //console.log("rgb("+color+","+color+","+color+")");
	          return "rgb("+color+","+color+", 255)";
	      })
	      .on('mouseover', function(d) {
	      		var pais = medalhas.filter( function(dd) {
	    			return dd.ID == d.id;
	    		});
	    		if (pais.length > 0)
	      			map_tip.show(d);
	      })
		  .on('mouseout', map_tip.hide)
	};
}