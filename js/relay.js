var relay = {
	switch: function(zone, action) {
		var msg = {
			device: "relay",
			zone: zone,
			action: action
		};
		$.post(config.localUrl, msg);
  	}
}