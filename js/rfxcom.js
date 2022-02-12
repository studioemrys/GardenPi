var rfxcom = {
	switch: function(zone, action) {
		var msg = {
			device: "rfxcom",
			zone: zone,
			action: action
		};
		$.post(config.localUrl, msg);
  	}
}