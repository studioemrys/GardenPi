var weatherStation = {
	icon: function(input) {
		switch (input) {
			case "zonnig":
				return "fa fa-sun";
				break;
			case "bliksem":
				return "fa fa-bolt";
				break;
			case "regen":
				return "fa fa-cloud-rain";
				break;
			case "buien":
				return "fa fa-cloud-showers-heavy";
				break;
			case "hagel":
				return "fa fa-cloud-meatball";
				break;
			case "mist":
				return "fa fa-smog";
				break;
			case "sneeuw":
				return "fa fa-snowflake";
				break;
			case "bewolkt":
				return "fa fa-cloud";
				break;
			case "halfbewolkt":
				return "fa fa-cloud-sun";
				break;
			case "zwaarbewolkt":
				return "fa fa-cloud";
				break;
			case "nachtmist":
				return "fa fa-smog";
				break;
			case "helderenacht":
				return "fa fa-moon";
				break;
			case "wolkennacht":
				return "fa fa-cloud-moon";
				break;
		}
	},
	wind: function(input) {
		switch (input) {
			case "Noord":
				return "wi-from-n";
				break;
			case "NNO":
				return "wi-from-nne";
				break;
			case "NO":
				return "wi-from-ne";
				break;
			case "ONO":
				return "wi-from-ene";
				break;
			case "Oost":
				return "wi-from-e";
				break;
			case "OZO":
				return "wi-from-ese";
				break;
			case "ZO":
				return "wi-from-se";
				break;
			case "ZZO":
				return "wi-from-sse";
				break;
			case "Zuid":
				return "wi-from-s";
				break;
			case "ZZW":
				return "wi-from-ssw";
				break;
			case "ZW":
				return "wi-from-sw";
				break;
			case "WZW":
				return "wi-from-wsw";
				break;
			case "West":
				return "wi-from-w";
				break;
			case "WNW":
				return "wi-from-wnw";
				break;
			case "NW":
				return "wi-from-nw";
				break;
			case "NNW":
				return "wi-from-nnw";
				break;
			case "N":
				return "wi-from-n";
				break;
			case "regen":
				return "fa fa-cloud-rain";
				break;
			case "buien":
				return "fa fa-cloud-showers-heavy";
				break;
			case "hagel":
				return "fa fa-cloud-meatball";
				break;
			case "mist":
				return "fa fa-smog";
				break;
			case "sneeuw":
				return "fa fa-snowflake";
				break;
			case "bewolkt":
				return "fa fa-cloud";
				break;
			case "halfbewolkt":
				return "fa fa-cloud-sun";
				break;
			case "zwaarbewolkt":
				return "fa fa-cloud";
				break;
			case "nachtmist":
				return "fa fa-smog";
				break;
			case "helderenacht":
				return "fa fa-moon";
				break;
			case "wolkennacht":
				return "fa fa-cloud-moon";
				break;
		}
	},
	moon: function(day, month, year) {

	    var c = e = jd = b = 0;

	    if (month < 3) {
	        year--;
	        month += 12;
	    }

	    ++month;

	    c = 365.25 * year;

	    e = 30.6 * month;

	    jd = c + e + day - 694039.09; //jd is total days elapsed

	    jd /= 29.5305882; //divide by the moon cycle

	    b = parseInt(jd); //int(jd) -> b, take integer part of jd

	    jd -= b; //subtract integer part to leave fractional part of original jd

	    b = Math.round(jd * 8); //scale fraction from 0-8 and round

	    if (b >= 8 ) {
	        b = 0; //0 and 8 are the same so turn 8 into 0
	    }

	    // 0 => New Moon
	    // 1 => Waxing Crescent Moon
	    // 2 => Quarter Moon
	    // 3 => Waxing Gibbous Moon
	    // 4 => Full Moon
	    // 5 => Waning Gibbous Moon
	    // 6 => Last Quarter Moon
	    // 7 => Waning Crescent Moon
	    switch (b) {
	    	case 0:
				return "new moon" 
		   		break;
	    	case 1:
				return "waxing crescent" 
		   		break;
	    	case 2:
				return "first quarter" 
		   		break;
	    	case 3:
				return "waxing gibbous" 
		   		break;
	    	case 4:
				return "full moon" 
		   		break;
	    	case 5:
				return "waning gibbous" 
		   		break;
	    	case 6:
				return "third quarter" 
		   		break;
	    	case 7:
				return "waning crescent" 
		   		break;
	    	default:
	    		// statements_def
	    		break;
	    }
	},
	load: function() {
		today = new Date;
		d1 = new Date;
		d2 = new Date;
		d0 = today.getDate()+"-"+(today.getMonth()+1);
		d1.setDate(today.getDate()+1);
		d1 = d1.getDate()+"-"+(d1.getMonth()+1);
		d2.setDate(today.getDate()+2);
		d2 = d2.getDate()+"-"+(today.getMonth()+1);
		moonphase = weatherStation.moon(today.getDate(),today.getMonth()+1,today.getFullYear());

		$.get(config.weerOnlineURL+config.weerOnlineLocation, function(response) {
			$('#weather-display-city').html(response.liveweer[0].plaats); 
			$('#weather-display-wind').html(response.liveweer[0].windr+" "+response.liveweer[0].winds);
			$('#weather-display-temperature').html(response.liveweer[0].temp+" °C");
			$('#weather-display-gtemp').html(response.liveweer[0].gtemp+" °C");
			$('#weather-display-wind-direction').addClass(weatherStation.wind(response.liveweer[0].windr));
			$('#weather-display-wind-force').addClass("wi-wind-beaufort-"+Math.round(response.liveweer[0].windk));
			$('#weather-display-humidity').html(response.liveweer[0].lv+" %");
			$('#weather-display-pressure').html(response.liveweer[0].luchtd);
			$('#weather-display-moon').attr("src", "img/"+moonphase+".jpg");
			$('#weather-display-moonphase').html(moonphase);
			$('#weather-forecast-day1').html(d0);
			$('#weather-forecast-day2').html(d1);
			$('#weather-forecast-day3').html(d2);
			$('#weather-forecast-day1-temperature').html(response.liveweer[0].d0tmax+" °C");
			$('#weather-forecast-day2-temperature').html(response.liveweer[0].d1tmax+" °C");
			$('#weather-forecast-day3-temperature').html(response.liveweer[0].d2tmax+" °C");
			$('#weather-forecast-day1-rain').html(response.liveweer[0].d0neerslag+" %");
			$('#weather-forecast-day2-rain').html(response.liveweer[0].d1neerslag+" %");
			$('#weather-forecast-day3-rain').html(response.liveweer[0].d2neerslag+" %");
			$('#weather-forecast-day1-sun').html(response.liveweer[0].d0zon+" %");
			$('#weather-forecast-day2-sun').html(response.liveweer[0].d1zon+" %");
			$('#weather-forecast-day3-sun').html(response.liveweer[0].d2zon+" %");
			$('#weather-forecast-day1-icon').addClass(weatherStation.icon(response.liveweer[0].d0weer));
			$('#weather-forecast-day2-icon').addClass(weatherStation.icon(response.liveweer[0].d1weer));
			$('#weather-forecast-day3-icon').addClass(weatherStation.icon(response.liveweer[0].d2weer));
			$('#weather-background').addClass(response.liveweer[0].d0weer);
		});		
	},
	start: function() {
		setInterval(function() {
			weatherStation.load();
		}, 600000);
	}
}