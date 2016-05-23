var olympicsApp = angular.module('olympicsApp', ['ngRoute']);

olympicsApp.config(['$routeProvider',
	function($routeProvider) {
	    $routeProvider.when('/gdp-medals', {
	        templateUrl: 'gdp.html',
			menu: 'gdp'
	    }).when('/population-medals', {
	        templateUrl: 'population.html',
			menu: 'population'
		}).when('/total-continents', {
			templateUrl: 'total-continents.html',
			menu: 'total',
			tab: 'continents'
	    }).otherwise({
	        templateUrl: 'total.html',
			menu: 'total',
			tab: 'countries'
	    });
}]);

olympicsApp.controller('olympicsCtrl', function($scope,
	                                            $route,
	                                            $filter,
	                                            $timeout) {
	$scope.dataset1 = medalhas;
	$scope.dataset2 = gdp;
	$scope.dataset3 = continents_dataset;
	$scope.barchart = medalhas;
	$scope.$route = $route;
	$scope.showYear = true;
		
	countries = [];
	var dataset_by_country = d3.nest().key(function(d) 
		{ return d.Country; })
	.entries(gdp);
	for (id in dataset_by_country) {
		countries.push(dataset_by_country[id].key);
	}
	
	continents = [];
	var dataset_by_continent = d3.nest().key(function(d) 
		{ return d.Continent; })
	.entries(medalhas);
	for (id in dataset_by_continent) {
		continents.push(dataset_by_continent [id].key);
	}
		
	years = [];
	var dataset_by_year = d3.nest().key(function(d) 
		{ return d.Year; })
	.entries(gdp);
	for (id in dataset_by_year) {
		years.push(dataset_by_year[id].key);
	};
	
	countries = countries.concat(continents);
	
	$scope.countries = 	countries
	$scope.years = years;
	$scope.search = {};
	$scope.timeline = {};
	$scope.plots = {};
	
	
	$scope.plots.list = [];
	$scope.timeline.year = 2008;
	$scope.search.results = $scope.countries;
	//$scope.search.medals = Number.POSITIVE_INFINITY;
	
	$scope.search.fn = function() {
		$scope.search.results = 
		    $filter('filter')($scope.countries, $scope.search.text);
		$scope.search.medals = Number.POSITIVE_INFINITY;
		autocomplete($scope.search.results);
		highlightCountries($scope.search.results);
	};
	
	$scope.search.click = function(country) {
		$scope.search.text = country;
		$scope.search.visible = false;
		$scope.search.autocompleted = true;
		$scope.plots.redrawAll($scope.timeline.year, $scope.search.text);
		$timeout(function() { highlightCountries([country]); }, 200);
	}
	
	$scope.clickCountry = function() {
		d3.selectAll("path:not(.Brazil)")
			.style("opacity", 0.2);
	}
	
	$scope.search.clear = function(event) {
		if (event.keyCode === 8 && $scope.search.autocompleted) {
			$scope.search.text = "";
			$scope.search.fn();
			$scope.search.autocompleted = false;
			$scope.plots.redrawAll($scope.timeline.year, $scope.search.text);
		}
	}
	
	$scope.search.blur = function () {
		$timeout(function () { $scope.search.visible = false }, 500);
	}
	
	$scope.plots.redrawAll = function(year, country) {
		angular.forEach($scope.plots.list, function(plot) {
			var y = year ? year : plot.year;			
			d3.select(plot.node).selectAll('*').remove();
			plot.fn(plot.node, plot.dataset, y, country);
		});
	};
	
	$scope.timeline.change = function(year) {
		$scope.timeline.year = year;
		$scope.plots.redrawAll(year);
		if ($scope.search.autocompleted) {
			$scope.plots.redrawAll($scope.timeline.year, $scope.search.text);
			$timeout(function () { highlightCountries([$scope.search.text]); }, 200);		
		}
	}	
	
	$scope.$on('$locationChangeStart', function(event) {
		if ($scope.search.autocompleted) {
				$scope.plots.redrawAll($scope.timeline.year, $scope.search.text);
				$timeout(function() { highlightCountries([$scope.search.text]); }, 200);
		}
	});
	
	//console.log($scope.countries)
	function highlightCountries(countries) {
		console.log($scope.search.text);
		d3.selectAll(".bars>g").style("opacity", "1");
		d3.selectAll("circle").style("opacity", "1");
		d3.selectAll("path").style("opacity", "1");
		console.log($scope.search.text)
		if (countries && countries.length > 0 && $scope.search.text) {
		    var country = countries[0];
			var medals = 
			    stackedBarDataset($scope.dataset1, $scope.timeline.year)
			        .filter(function (x) {
				        return x.Country == $scope.search.text;
			        })[0];
			if ($scope.search.text == country) {
				$scope.search.medals = 
				    medals ? medals.Bronze + medals.Silver + medals.Gold : 0;
			}
		    d3.selectAll(".bars>g:not(." + country.replace(/ /g, "_") + ")"
		                      + ":not(.axis):not(.legend)")
		      .style("opacity", "0.1");		
			d3.selectAll("circle:not(.datapoint):not(." + country.replace(/ /g, "_") + ")")
  	      	  .style("opacity", "0.1");	
  			d3.selectAll("circle." + country.replace(/ /g, "_"))
			  .style("stroke", 'red')
			  .style("fill", 'red');
			  //.attr('stroke-width', '10');		
		    d3.selectAll("path:not(." + country.replace(/ /g, "_") + ")")
			  .style("opacity", 0.2);  
		}
	}
	
	function autocomplete(countries) {
		if (countries && countries.length == 1) {
			$scope.search.text = countries[0];
			$scope.search.visible = false;
			$scope.search.autocompleted = true;
			$scope.plots.redrawAll($scope.timeline.year, $scope.search.text);
		} else if (countries && countries.length > 1) {
			$scope.search.visible = true;
		}  else {
			$scope.search.visible = false;
			$scope.search.autocompleted = false;
		}
	}
});

olympicsApp.directive('plot', function ($window) {
	return {
		restrict: 'E',
		scope: {
			val: '=',
			type: '@',
		},
		link: function (scope, element, attrs) {
			var node = element[0].parentElement;
			plotFn = $window[scope.type];
			scope.$parent.plots.list.push({
				"node": node, 
				"fn": plotFn,
				"dataset": scope.val,
				"year": scope.$parent.timeline.year // TODO: might be removed?
			});			
			plotFn(node, scope.val, scope.$parent.timeline.year);
			
			window.onresize = function() {
				scope.$parent.plots.redrawAll();
			};
		}
	}
});