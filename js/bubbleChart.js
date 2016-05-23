function bubblechart (element, dataset, year){
	if (element.clientWidth <=0 ) return;
	if (year < 1960) {
		return;
	}
    
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

	var margin = {top: 12, right: 30, bottom: 83, left: 40},
      outerWidth = element.clientWidth,
      outerHeight = element.clientWidth/1.8,
    	width = element.clientWidth - margin.left - margin.right,
    	height = element.clientWidth/1.8 - margin.top - margin.bottom;
	
  var dataset = dataset.filter(function (x) { 
      return x.Year == year;
  });
  var dataset = dataset.filter(function (x) { 
    return x["Total Medals"] > 0; 
  });
  // usando biblioteca dimple 
  /*
  var margin = {top: 12, right: 12, bottom: 83, left: 5},
      width = element.clientWidth - margin.left - margin.right,
      height = element.clientWidth/1.8 - margin.top - margin.bottom;



  var svg = dimple.newSvg("#bubblecontainer", width, height);
  var myChart = new dimple.chart(svg, dataset);
  //setBounds (x,y,w,h)
  myChart.setBounds(50, 30, width-140, height-100)
  var x = myChart.addLogAxis("x", "Total Medals",10);
  //x.addOrderRule("Total Medals");

  myChart.addMeasureAxis("y", "GDP");
  myChart.addMeasureAxis("z", "Population");
  myChart.addSeries("Country", dimple.plot.bubble);
  //myChart.addLegend(width-80, 30, 20, 500, "left");
  myChart.draw();
  */

  var x = d3.scale.log()
  .rangeRound([1, width-80]).nice();

  var y = d3.scale.linear()
  .range([height, 0]).nice();

  var xCat = "Total Medals",
      yCat = "GDP",
      rCat = "Population",
      colorCat = "Country";

  var xMax = d3.max(dataset, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(dataset, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(dataset, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(dataset, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([1, 400]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      //.tickValues([0,5,10,25,50,100,200,300])
      .tickFormat(d3.format(".0d"));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("s"));

  var color = d3.scale.category20();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return d[colorCat].bold() + "<br>" + xCat + ": " + d[xCat] 
        + "<br>" + yCat + ": " + (d[yCat]/1000000000000).toFixed(2) + " T"
        + "<br>" + rCat + ": " + (d[rCat]/1000000).toFixed(2) + " M";
      });



  var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1,25])
    .on("zoom", zoom);

  var svg = d3.select(element).append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

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
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.right - 9.5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

//grid lines
/*
  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);
     */ 

  objects.selectAll(".dot")
      .data(dataset)
    .enter().append("circle")
	   .attr("class", function(d) { return d.Country.replace(/\ /g, "_"); })
      .classed("dot", true)
	  
      .attr("r", function (d) { return 0.0025 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[colorCat]); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
  var allDots = document.getElementsByClassName("dot");

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
};