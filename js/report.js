var report = {
	log: function(book, rules) {
		var msg = {
			device: "log",
			book: book
		};
		$.post(config.localUrl, msg)
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