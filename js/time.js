var time = {

	sunrise: '',
	sunset: '',
	rawTime: '',
	date: function() {
		rawDate = new Date();
		html = rawDate.getDate()+"-"+(rawDate.getMonth()+1)+"-"+rawDate.getFullYear();
		$('#date-display').html(html);
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
		jQuery.get(config.buienRadarURL, function(response) {
			$('#time-sunrise').html(response.actual.sunrise.substring(11, 16)); 
			$('#time-sunset').html(response.actual.sunset.substring(11, 16));
		});
	}
}