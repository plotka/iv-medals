function medals_sports(element, full_dataset, year, country) {
	if (element.clientWidth <=0 ) return;
	if (!country) return;
	
	//Filtrar por ano e por país
	var country_dataset = full_dataset.filter(function (x) { 
		return x.Country == country &&  x.Olympics == year;
	});
	
	if (country_dataset.length <= 0) return;
	
	//Agrupar os dados por categoria
	var data_by_category = d3.nest().key( function(d) {
    	return d.Category; }).entries(country_dataset)
	
	//Construir os dados de modo a ter: {Volleball:, Canoe:,...}	
	country_dataset = []; 
	for (i in data_by_category) {
		var obj = new Object();
		obj["Category"] = data_by_category[i].key;
		obj["Medalhas"] = data_by_category[i].values.length;
		country_dataset.push(obj);
	};	
	
	country_dataset.sort(function(a, b) { return b.Medalhas - a.Medalhas; });
	
	categories = [];
	for (i in country_dataset) {
		categories.push( country_dataset[i].Category);
	};		

	var margin = {top: 20, right: 7, bottom: 0, left: 115},
    	width = element.clientWidth/1.15 - margin.left - margin.right,
		height = element.clientWidth - margin.top - margin.bottom;
	

	var x = d3.scale.linear()
			  .domain([0, d3.max(country_dataset, function(d) { 
						return d.Medalhas; })])
			  .range([0, width]);

	var y = d3.scale.ordinal()
			  .domain(categories)
			  .rangeBands([0,height]);	  
	
	var svg = d3.select(element)
				.append("svg")
			    .attr("class", "medalhasDesporto")
	    		.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  //Mouseover tip
    var tip = d3.tip()
  				.attr('class', 'd3-tip')
  	            .offset([-20, 40])
  	            .html(function(d) {
	    			return "<strong>Cateogry:</strong>" + " " + 
					d.Category + "<br>" + "<strong>Number of medals:</strong>"+ 
					" " + d.Medalhas; 
	});
	svg.call(tip);

	var	xAxis = d3.svg.axis()
			      .scale(x)
				  .orient('top');

	var	yAxis = d3.svg.axis()
			.orient('left')
			.scale(y);

   svg.append("g")
      .attr("class", "x axis")
	  .call(xAxis);

   svg.append("g")
      .attr("class", "y axis")
	  .call(yAxis);
	  
	  
	  
	  
   var barWidth = height/categories.length;
   var barSpace = 1;
   
   svg.selectAll(".bar")
	   .data(country_dataset)
	   .enter().append("rect")
       .attr('class', 'bar')
   	   .attr("x", 0)
	   .attr("height", y.rangeBand())
	   .attr("width", 0)
   	   .attr("y", function(d,i) { return y(d.Category); })
   	   .on('mouseover', tip.show)
       .on('mouseout', tip.hide)	
	   .transition()
   	   .duration(1000) 
  	   .attr("width", function (d) { return x(d.Medalhas); });

  	   
};	