function scatterPlot2(element, dataset, year){
	if (element.clientWidth <=0 ) return;
	if (year < 1960) {
		return;
	}	
	
	//Filtrar por um ano
  	var dataset = dataset.filter(function (x) { 
		return x.Year == year;
	});

    var dataset = dataset.filter(function (x) { 
      return x["Population\/Medals"] > 0; 
    });
	// Set the dimensions of the canvas / graph
	var margin = {top: 12, right: 30, bottom: 83, left: 40},
  		outerWidth = element.clientWidth,
  		outerHeight = element.clientWidth/1.8,
		width = element.clientWidth - margin.left - margin.right,
		height = element.clientWidth/1.8 - margin.top - margin.bottom;
	//var padding = 30;
	//var bisectyear = d3.bisector(function(d) { return d.GDP; }).left;
	
	
	
var x = d3.scale.log()
    .range([1, width-80]).nice();

var y = d3.scale.linear()
			.range([height, 0]).nice();

var xCat = "Population\/Medals",
    yCat = "GDP";

var xMax = d3.max(dataset, function(d) { return d[xCat]; }) * 1.05,
	xMin = d3.min(dataset, function(d) { return d[xCat]; }),
	xMin = xMin > 0 ? 0 : xMin,
	yMax = d3.max(dataset, function(d) { return d[yCat]; }) * 1.05,
	yMin = d3.min(dataset, function(d) { return d[yCat]; }),
	yMin = yMin > 0 ? 0 : yMin;
	

	
 
  //x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  x.domain([20000, 1126419321]);

  var xAxis = d3.svg.axis()
      .scale(x)
  	  .orient("bottom")
  	  .tickValues([20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 
		  5000000, 10000000, 20000000, 50000000, 100000000, 200000000, 400000000])
	  .tickFormat(d3.format("0s"));
      //.tickSize(-height);
	  
	  

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
	  .tickFormat(d3.format("s"));
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
				"<strong>Population/medals:</strong> " + 
				nFormatter(d["Population\/Medals"]) + "<br>" + 
				"<strong>GDP:</strong> " + nFormatter(d.GDP)
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
      .text("Population/medals");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.right - 9)
	  //.attr("x", -50)
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