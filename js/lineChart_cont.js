function gen_vis_cont(element, dataset, year, continent){
	if (element.clientWidth <=0 ) return;
	if (!continent) return;
	//Filtrar por país
	var dataset = dataset.filter(function (x) { 
		return x.Continent == continent;
	});


	//Agrupar os dados por ano
	var data_by_year = d3.nest().key(function(d) 
		{ return d.Olympics; })
		.entries(dataset);

	
	//Construir os dados de modo a ter: {Year:, Total Medals:}
	dataset = []; 
  	for (i in data_by_year) {
		var obj = new Object();
		obj.Year = data_by_year[i].key;
		obj["Total Medals"] = data_by_year[i].values.length;
    	dataset.push(obj);
  	}
		
	// Set the dimensions of the canvas / graph
	var margin = {top: 10, right: 30, bottom: 20, left: 35},
	    width = element.clientWidth - margin.left - margin.right,
    	height = element.clientWidth/2 - margin.top - margin.bottom;
	//var padding = 30;
	//var bisectyear = d3.bisector(function(d) { return d.Year; }).left;
	
	// Set the scales
	var x = d3.scale.linear()
					.domain([dataset[0].Year, dataset[dataset.length-1].Year])
					.range([0, width]);
	
	var y = d3.scale.linear()
					.domain([0, d3.max(dataset, function(d) { 
						return d["Total Medals"]; })])
					.range([height, 0]);
	
	// Define the axes
	var xAxis = d3.svg.axis()
					  .scale(x)
	          	  	  .orient("bottom")
					  .ticks(dataset.length/2) 
					  .tickFormat(d3.format("f"))

	var yAxis = d3.svg.axis()
					  .scale(y)
					  .orient("left")
					  .ticks(dataset.length/2);
    
	// Adds the svg canvas
	var svg = d3.select(element)
	    		.append("svg")
	        	.attr("width", width + margin.left + margin.right)
	        	.attr("height", height + margin.top + margin.bottom)
	    		.append("g")
	        	.attr("transform",
						  "translate(" + margin.left + "," + margin.top + ")");
						  
	// function to draw the line
	var line = d3.svg.line()
	    		     .x(function(d) { return x(d.Year); })
	   				 .y(function(d) { return y(d["Total Medals"]); });
							  
  //Mouseover tip
    var tip = d3.tip()
  				.attr('class', 'd3-tip')
  	            .offset([-20, 40])
  	            .html(function(d) {
			    	return "<strong>Number of medals:</strong>" + " " + d["Total Medals"] + "<br>" 
							+ "<strong>Year:</strong>"+ " " + d.Year; 
	});
	svg.call(tip);


// add the x axis and x-label
    svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	  //.selectAll("text")
	  //.attr("y", 9)
	  //.attr("x", 9)
	  //.attr("dy", ".35em")
	  //.attr("transform", "rotate(0)")
	  //.style("text-anchor", "start");
    
	//svg.append("text")
	  //.attr("class", "xlabel")
	  //.attr("text-anchor", "middle")
	  //.attr("x", width / 2)
	  //.attr("y", height + margin.bottom);
	  //.text("");

    // add the y axis and y-label
    svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxis);
    svg.append("text")
	  .attr("class", "ylabel")
	  .attr("y", 0 - margin.left) // x and y switched due to rotation!!
	  .attr("x", 0 - (height / 4))
	  .attr("dy", "3.8em")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
	  .text("number of medals");

    //svg.append("text")
	//  .attr("class", "graphtitle")
	//  .attr("y", 7)
	//  .attr("x", width/2)
	//  .style("text-anchor", "middle")
	//  .text("");


	// draw the line
    svg.append("path")
	   .attr("d", line(dataset));

	svg.selectAll(".dot")
		  .data(dataset)
		  .enter().append("circle")
		  .attr('class', 'datapoint')
		  .attr('cx', function(d) { return x(d.Year); })
		  .attr('cy', function(d) { return y(d["Total Medals"]); })
		  .attr('r', 3)
		  .attr('fill', 'white')
		  .attr('stroke', 'steelblue')
		  .attr('stroke-width', '3')
		  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide);

};
//http://www.frankcleary.com/making-an-interactive-line-graph-with-d3-js/