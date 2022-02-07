var daytimeSync = {
	url: 'http://192.168.0.170:5050',
	switch: function(zone, action) {
		var msg = {
			device: "daytimeSync",
			zone: zone,
			action: action
		};
		$.post(daytimeSync.url, msg);
  	}	
}