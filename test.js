const rfxcom = require('rfxcom');
var rfxtrx = new rfxcom.RfxCom('/dev/ttyUSB0', {debug: true})
//lighting2 = new rfxcom.Lighting2(rfxtrx, rfxcom.lighting2.HOMEEASY_EU);


rfxtrx.on("security1", function(evt){
	console.log(evt)
}) 

rfxtrx.initialise(function () {

})
