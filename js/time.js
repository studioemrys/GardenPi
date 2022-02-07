var time = {

	sunrise: '',
	sunset: '',
	rawTime: '',
	date: function() {
		rawDate = new Date();
		date = rawDate.getDate()+"-"+(rawDate.getMonth()+1)+"-"+rawDate.getFullYear();
		$('#date-display').html(date);
	},
	loadTime: function() {
		rawDate = new Date();
		html = rawDate.getHours()+":"+(rawDate.getMinutes()<10?'0':'') + rawDate.getMinutes()+":"+(rawDate.getSeconds()<10?'0':'') + rawDate.getSeconds();
		$('#time-display').html(html);		
	},
	clock: function() {
		setInterval(function() {time.loadTime()}, 60);
	},
	sun: function() {
		jQuery.get('https://data.buienradar.nl/2.0/feed/json', function(response) {
			$('#time-sunrise').html(response.actual.sunrise.substring(11, 16)); 
			$('#time-sunset').html(response.actual.sunset.substring(11, 16));
		});
	}
}