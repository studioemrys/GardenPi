var rfxcom = {
	url: 'http://192.168.0.170:5050',
	switch: function(zone, action) {
		var msg = {
			device: "rfxcom",
			zone: zone,
			action: action
		};
		$.post(rfxcom.url, msg);
  	}
}