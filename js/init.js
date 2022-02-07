$(document).ready(function() {

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

	//Initialise functions
	time.date();
	time.sun();
	weatherStation.city = 'Nuenen';
	weatherStation.load();
	time.clock();
	weatherStation.start();
	report.log('light', -11);
	report.log('sprinkler', -11);


	//set button states
	switches.init('4', 'light', '#lampBtn1');
	switches.init('1', 'light', '#lampBtn2');
	switches.init('2', 'light', '#lampBtn3');
	switches.init('3', 'light', '#lampBtn4');

	switches.init('4', 'sync', '#daytimeSyncBtn1');
	switches.init('1', 'sync', '#daytimeSyncBtn2');
	switches.init('2', 'sync', '#daytimeSyncBtn3');
	switches.init('3', 'sync', '#daytimeSyncBtn4');
	
	switches.init('1', 'pump', '#relayBtn1');
	switches.init('2', 'pump', '#relayBtn2');
	switches.init('3', 'pump', '#relayBtn3');
	switches.init('4', 'pump', '#relayBtn4');
	switches.init('5', 'pump', '#relayBtn5');


	//Listener functions
	$('#lampBtn1').change(function() {
		if($(this).prop('checked')) {
			rfxcom.switch(4, 1);
		}
		else {
			rfxcom.switch(4, 0);
		}
	});
	$('#lampBtn2').change(function() {
		if($(this).prop('checked')) {
			rfxcom.switch(1, 1);
		}
		else {
			rfxcom.switch(1, 0);
		}
	});
	$('#lampBtn3').change(function() {
		if($(this).prop('checked')) {
			rfxcom.switch(2, 1);
		}
		else {
			rfxcom.switch(2, 0);
		}
	});
	$('#lampBtn4').change(function() {
		if($(this).prop('checked')) {
			rfxcom.switch(3, 1);
		}
		else {
			rfxcom.switch(3, 0);
		}
	});
	$('#daytimeSyncBtn1').change(function() {
		if($(this).prop('checked')) {
			daytimeSync.switch(1, 1);
		}
		else {
			daytimeSync.switch(1, 0);
		}
	});		
	$('#daytimeSyncBtn2').change(function() {
		if($(this).prop('checked')) {
			daytimeSync.switch(2, 1);
		}
		else {
			daytimeSync.switch(2, 0);
		}
	});		
	$('#daytimeSyncBtn3').change(function() {
		if($(this).prop('checked')) {
			daytimeSync.switch(3, 1);
		}
		else {
			daytimeSync.switch(3, 0);
		}
	});		
	$('#daytimeSyncBtn4').change(function() {
		if($(this).prop('checked')) {
			daytimeSync.switch(4, 1);
		}
		else {
			daytimeSync.switch(4, 0);
		}
	});		
	$('#relayBtn1').change(function() {
		if($(this).prop('checked')) {
			relay.switch(1, 1);
		}
		else {
			relay.switch(1, 0);
		}
	});
	$('#relayBtn2').change(function() {
		if($(this).prop('checked')) {
			relay.switch(2, 1);
		}
		else {
			relay.switch(2, 0);
		}
	});
	$('#relayBtn3').change(function() {
		if($(this).prop('checked')) {
			relay.switch(3, 1);
		}
		else {
			relay.switch(3, 0);
		}
	});
	$('#relayBtn4').change(function() {
		if($(this).prop('checked')) {
			relay.switch(4, 1);
		}
		else {
			relay.switch(4, 0);
		}
	});
	$('#relayBtn5').change(function() {
		if($(this).prop('checked')) {
			relay.switch(5, 1);
		}
		else {
			relay.switch(5, 0);
		}
	});
});