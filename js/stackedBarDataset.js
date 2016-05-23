function stackedBarDataset(dataset, Year) {
	//Filtrar por ano
  	var dataset = dataset.filter(function (x) { 
		return x.Olympics == Year;
	});
	
	//Agrupar os dados por país
	var data_by_country = d3.nest().key(function(d) 
	{ return d.Country; })
	.entries(dataset);
	
	//Agrupar os dados por tipo de medalha
	var data_by_medal = [];
	for (id in data_by_country) {
		data_by_medal.push( {
			Country: data_by_country[id].key, 			
			values: d3.nest().key(function(d) 
			{ return d.Medal; })
			.entries(data_by_country[id].values)});
		};

		//Construir os dados de modo a ter: {Gold:, Silver:, Bronze:, Country:}	
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
			obj.Country =  data_by_medal[i].Country;
			dataset.push(obj);
		};
		
		return dataset
}
