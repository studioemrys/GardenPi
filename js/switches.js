var switches = {
	url: 'http://192.168.0.170:5050',
	init: function(zone, kind, btnname) {
		var msg = {
			zone: zone,
			kind: kind,
			device: "switches"
		};
		$.post(switches.url, msg)
		.done(function(response) {
			if (Number(response) === 1) {
				$(btnname).prop('checked', true);
			}
			else {
				$(btnname).prop('checked', false);
			}
		});
  	}
}