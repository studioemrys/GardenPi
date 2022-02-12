var daytimeSync = {
	switch: function(zone, action) {
		var msg = {
			device: "daytimeSync",
			zone: zone,
			action: action
		};
		$.post(config.localUrl, msg);
  	}	
}