function stackedBarChart_cont(element, dataset, year) {
	//Filtrar por ano
  	if (element.clientWidth <=0 ) return;
	var dataset = dataset.filter(function (x) { 
		return x.Olympics == year;
	});

	//Agrupar os dados por país
	var data_by_continente = d3.nest().key(function(d) 
		{ return d.Continent; })
		.entries(dataset);
		
	//Agrupar os dados por tipo de medalha
	var data_by_medal = [];
	for (id in data_by_continente) {
		data_by_medal.push( {
			Continent: data_by_continente[id].key, 			
			values: d3.nest().key(function(d) 
			{ return d.Medal; })
			.entries(data_by_continente[id].values)});
	};
	
	//Construir os dados de modo a ter: {Gold:, Silver:, Bronze:, Continent:}	
	medals = ["Gold", "Silver", "Bronze"];
	dataset = []; 
	for (i in data_by_medal) {
		var obj = new Object();
		for (j in data_by_medal[i].values){			
			if (data_by_medal[i].values[j].key == "Gold") {
				obj.Gold = data_by_medal[i].values[j].values.length;
			} else if (data_by_medal[i].values[j].key == "Silver") {
				obj.Silver = data_by_medal[i].values[j].values.length;
			} else {
				obj.Bronze = data_by_medal[i].values[j].values.length;
			}		
		};
		for (z in medals) {
			if (!(medals[z] in obj)) {
				obj[medals[z]] = 0;
			}
		};
		obj.Continent =  data_by_medal[i].Continent;
		dataset.push(obj);
	};	
			
	//Filtrar o dataset por paises com mais de tres medalhas
	//var dataset = dataset.filter(function (x) { 
	//	return x.Bronze + x.Silver + x.Gold > 3; 
	//});
	
	//var country = [];
	//var margin = {top: 25, right: 80, bottom: 50, left: 130},
	//    width = 1000 - margin.left - margin.right,
	//    height = 1300 - margin.top - margin.bottom;

    var margin = {top: 12, right: 30, bottom: 83, left: 55},
        width = element.clientWidth - margin.left - margin.right,
	    height = element.clientWidth/1.8 - margin.top - margin.bottom;


	/*var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .rangeRound([height, 0]);*/

	var y = d3.scale.linear()
	          .rangeRound([height, 0]); 

	var x = d3.scale.ordinal()
	          .rangeRoundBands([0, width], .2); 


	var color = d3.scale.ordinal()
	    .range(["#D9A441", "#CCC2C2", "965A38"]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
		//.tickPadding(-10);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	    // .tickFormat(d3.format(".2s"));

	var svg = d3.select(element).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
		.attr("class", "bars")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  color.domain(d3.keys(dataset[0]).filter(function(key) { return key !== "Continent"; }));

	  dataset.forEach(function(d) {
	    var mycontinent = d.Continent;
	    var y0 = 0;
		d.medals = color.domain().slice(0,3).map(function(name) { return {
			mycontinent:mycontinent, name: name, y0: y0, y1: y0 += +d[name]}; });		
	    d.total = d.medals[d.medals.length - 1].y1;
	  });

	  dataset.sort(function(a, b) { return b.total - a.total; });
	  x.domain(dataset.map(function(d) { return d.Continent; }));
	  y.domain([0, d3.max(dataset, function(d) { return d.total; })]);


	//Mouseover tip
	var tip = d3.tip()
				.attr('class', 'd3-tip')
	            .offset([-20, 40])
	            .html(function(d) {
			    	return "<strong>Continent:</strong>" + " " + d.mycontinent + 
						"<br>"  + "<strong>" + "Number of " + 
						d.name.toLowerCase() + " medals:</strong> " + 
						(d.y1 - d.y0) + "<br>"; 
	});
	svg.call(tip);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height +")")
	      .call(xAxis)
	.selectAll("text");
          	//.style("text-anchor", "end")
            //.attr("dx", "-.8em")
			//.attr("dy", ".15em")
            //.attr("transform", "rotate(0)" );

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	       .attr("y", -margin.left)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("number of medals");



	  var country = svg.selectAll(".country")
	      .data(dataset)
	      .enter().append("g")
	      .attr("class", function(d) { return d.Continent.replace(/\ /g, "_"); })
          .attr("transform", 
		  function(d) { return "translate(" + x(d.Continent) + ",0)"; });  

		  
	  country.selectAll("rect")
	    .data(function(d) { return d.medals; })
	    .enter().append("rect")
	      .attr("width", x.rangeBand())
		 // .attr("x", 5)
	      .attr("y", height)
	      .attr("height", 0)
		  .style("fill", function(d) { return color(d.name); })
	  	  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide)
  	      .transition()
     	  .duration(1000) 
	      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    	  .attr("y", function(d) { return y(d.y1); });	  		  
		  
	  var legend = svg.selectAll(".legend")
	      .data(color.domain().slice(0,3))
	      .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });
};