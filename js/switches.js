var switches = {
	init: function(zone, kind, btnname) {
		var msg = {
			zone: zone,
			kind: kind,
			device: "switches"
		};
		$.post(config.localUrl, msg)
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