var report = {
	url: 'http://192.168.0.170:5050',
	log: function(book, rules) {
		var msg = {
			device: "log",
			book: book
		};
		$.post(report.url, msg)
		.done(function(response) {
			lines = response.split("\n");
			lastLines = lines.slice(rules);
			html = "";
			lastLines.forEach(function(element, index) {
				html += "<h6>"+element+"</h6>";
			});
			$('#display-report-'+book).html(html);
		});
  	}
}