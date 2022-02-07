var relay = {
	url: 'http://192.168.0.170:5050',
	switch: function(zone, action) {
		var msg = {
			device: "relay",
			zone: zone,
			action: action
		};
		$.post(relay.url, msg);
  	}
}