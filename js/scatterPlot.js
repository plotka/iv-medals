function scatterPlot(element, dataset, year){
	if (element.clientWidth <=0 ) return;
	if (year < 1960) {
		return;
	}	
	
	//Filtrar por um ano
  	var dataset = dataset.filter(function (x) { 
		return x.Year == year;
	});
	
    var dataset = dataset.filter(function (x) { 
      return x["Total Medals"] > 0; 
    });

 	//x(d.Population); })
	// d["Total Medals"

	var margin = {top: 12, right: 30, bottom: 83, left: 41},
		outerWidth = element.clientWidth,
		outerHeight = element.clientWidth/1.8,
		width = element.clientWidth - margin.left - margin.right,
		height = element.clientWidth/1.8 - margin.top - margin.bottom;
	
	var x = d3.scale.log()
	    .range([0, width-80]);

	var y = d3.scale.linear()
				.range([height, 0]).nice();

	var xCat = "Total Medals",
	    yCat = "Population";

	var xMax = d3.max(dataset, function(d) { return d[xCat]; }) * 1.05,
		xMin = d3.min(dataset, function(d) { return d[xCat]; }),
		xMin = xMin > 0 ? 0 : xMin,
		yMax = d3.max(dataset, function(d) { return d[yCat]; }) * 1.05,
		yMin = d3.min(dataset, function(d) { return d[yCat]; }),
		yMin = yMin > 0 ? 0 : yMin;
		
		//console.log(xMax);
		//console.log(xMin);
		//console.log(yMax);
		//console.log(yMin);
		
     
	  //x.domain([xMin, xMax]);
	  y.domain([yMin, yMax]);
	  x.domain(d3.extent(dataset, function (d){ return d[xCat]; }));


	  var xAxis = d3.svg.axis()
	      .scale(x)
	  .orient("bottom")
	  .tickFormat(d3.format(".1"));;
	      //.tickSize(-height);
		  
		  

	  var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
		  .tickFormat(d3.format(".2s"));
	      //.tickSize(-width);

	  var tip = d3.tip()
	      .attr("class", "d3-tip")
	      .offset([-20, 40])
	      .html(function(d) {
	        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
	      });

	  var zoomBeh = d3.behavior.zoom()
	      .x(x)
	      .y(y)
	      .scaleExtent([0, 100])
	      .on("zoom", zoom);

	  var svg = d3.select(element)
	    .append("svg")
	      .attr("width", outerWidth)
	      .attr("height", outerHeight)
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	      .call(zoomBeh);
		  
		  
		  
  	function nFormatter(num) {
  		 if (num >= 1000000000000) {
  	        return (num / 10000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  		 }
  		 if (num >= 1000000000) {
  	        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  		 }
 	
  	     if (num >= 1000000) {
  	        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  	     }
  	     if (num >= 1000) {
  	        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  	     }
  	     return num;
  	}							  
    //Mouseover tip
      var tip = d3.tip()
    				.attr('class', 'd3-tip')
    	            .offset([-20, 40])
    	            .html(function(d) {
  		    	return "<strong>Country:</strong>" + " " + d.Country + "<br>"  + 
  					"<strong>Number of medals:</strong> " + 
  					nFormatter(d["Total Medals"]) + "<br>" + 
  					"<strong>Population:</strong> " + nFormatter(d.Population)
  					 + "<br>"; 
  	});
  	svg.call(tip);		  
		  
		  
	  svg.append("rect")
	      .attr("width", width)
	      .attr("height", height);

	  svg.append("g")
	      .classed("x axis", true)
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
      	.classed("label", true)
      	.attr("x", width-80)
      	.attr("y", margin.bottom-40)
      	.style("text-anchor", "end")
	      .text("Total medals");

	  svg.append("g")
	      .classed("y axis", true)
	      .call(yAxis)
	    .append("text")
      	.classed("label", true)
      	.attr("transform", "rotate(-90)")
      	.attr("y", -margin.right - 10.5)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
	      .text(yCat);

	 var objects = svg.append("svg")
	      .classed("objects", true)
	      .attr("width", width)
	      .attr("height", height);



	  objects.selectAll(".dot")
	      .data(dataset)
	      .enter().append("circle")
		  .attr("class", function(d) { return d.Country.replace(/\ /g, "_"); })
	      .classed('dot', true)
		  
	  
	      //.attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
		  //.attr('cx', function(d) { return x(d["Total Medals"]); })
		  //.attr('cx', function(d) { return x(d["Total Medals"]); })
		  .attr("transform", transform)
		  
		  .attr('r', 3)
		  .attr('fill', 'white')
		  .attr('stroke', 'steelblue')
		  .attr('stroke-width', '3')
		  
	      //.style("fill", function(d) { return color(d[colorCat]); });
	     .on("mouseover", tip.show)
	     .on("mouseout", tip.hide);


	  function transform(d) {
	    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
	  }


	  function zoom() {
	    svg.select(".x.axis").call(xAxis);
	    svg.select(".y.axis").call(yAxis);

	    svg.selectAll(".dot")
	        .attr("transform", transform);
	  }
  
		  
};
//http://bl.ocks.org/bunkat/2595950