//Loading required libraries
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const rfxcom = require('rfxcom');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Milight = require('node-milight-promise');
const commands = Milight.commandsV6;
const settings = JSON.parse(fs.readFileSync('./settings.json'));

var hermes = {
	log: function(book, input) {
		timeStamp = new Date;
		line = timeStamp + "\t\t" + input + "\n";
		switch (book) {
			case "light":
				fs.appendFileSync("./log/light.log", line);
				break;
			case "sprinkler":
				fs.appendFileSync("./log/sprinkler.log", line);
				break;
			case "app":
				fs.appendFileSync("./log/app.log", line);
				break;
		}

	}
}

var led = new Milight.MilightController({
    ip: settings.milightIP,
    type: 'v6'
  });

var pump = {
	timer: function(sprinkleTime) {
		pump.set(sprinkleTime[5].zone, 1);
		setTimeout(function() {
			pump.set(sprinkleTime[5].zone, 0);
			pump.set(sprinkleTime[2].zone, 1);
			setTimeout(function() {
				pump.set(sprinkleTime[2].zone, 0);
				pump.set(sprinkleTime[4].zone, 1);
				setTimeout(function() {
					pump.set(sprinkleTime[4].zone, 0);
					pump.set(sprinkleTime[3].zone, 1);
					setTimeout(function() {
						pump.set(sprinkleTime[3].zone, 0);
					}, sprinkleTime[3].duration*60000);
				}, sprinkleTime[4].duration*60000);
			}, sprinkleTime[2].duration*60000);
		}, sprinkleTime[5].duration*60000);
	},
	set: function(zone, action) {
		relays = fs.readFileSync('./json/pump.json');
		relays = JSON.parse(relays);
	   	gpioPin = new gpio(Number(relays[zone]['gpio']), 'out');
    	gpioPin.writeSync(Number(action));
    	hermes.log('sprinkler','Changed pump '+zone+' to position '+action);
	},
	change: function(zone, action) {
		relays = fs.readFileSync('./json/pump.json');
		relays = JSON.parse(relays);
		relays[zone]["action"] = action;
		fs.writeFileSync('./json/pump.json', JSON.stringify(relays));
		hermes.log('sprinkler','wrote pump position to pump.json');
	}
}

var daytimeSync = {
	sunrise: new Date(),
	sunset: new Date(),
	get: function(callback) {
		
		https.get('https://data.buienradar.nl/2.0/feed/json', function(data){
			hermes.log('light','Loading sunrise and sunset data...');
			body = '';
			data.on('data', function(chunk) {
				body += chunk;
			});
			data.on('end', function() {
				response = JSON.parse(body);
				daytimeSync.sunrise.setHours(response.actual.sunrise.substring(11,13));
				daytimeSync.sunrise.setMinutes(response.actual.sunrise.substring(14,16));
				daytimeSync.sunset.setHours(response.actual.sunset.substring(11,13));
				daytimeSync.sunset.setMinutes(response.actual.sunset.substring(14,16));
				hermes.log('light','Sunrise set @ '+daytimeSync.sunrise.toString());
				hermes.log('light','Sunset set @ '+daytimeSync.sunset.toString());
				callback();
			});
		});
	},
	set: function() {
		syncs = fs.readFileSync('./json/sync.json');
		syncs = JSON.parse(syncs);
		hermes.log('light','Garden lights synced with sunrise and sunset');
		for (zone in syncs) {
			
			if (Number(syncs[zone]['action'])===1) {
				
				switch (Number(zone)) {
					case 1:
						schedule.scheduleJob('sunsetAlarm1', this.sunset.toString(), function(){
							led.sendCommands(commands.fullColor.on(1));
							hermes.log('light','sunset alarm fired for zone 1');
						}); 
						
						schedule.scheduleJob('sunriseAlarm1', this.sunrise.toString(), function() {
							led.sendCommands(commands.fullColor.off(1));
							hermes.log('light','sunrise alarm fired for zone 1');
						});
						break;
					case 2:
						schedule.scheduleJob('sunsetAlarm2', this.sunset.toString(), function(){
							led.sendCommands(commands.fullColor.on(2));
							hermes.log('light','sunset alarm fired for zone 2');
						}); 
						
						schedule.scheduleJob('sunriseAlarm2', this.sunrise.toString(), function() {
							led.sendCommands(commands.fullColor.off(2));
							hermes.log('light','sunrise alarm fired for zone 2');
						});
						break;
					case 3:
						schedule.scheduleJob('sunsetAlarm3', this.sunset.toString(), function(){
							led.sendCommands(commands.fullColor.on(3));
							hermes.log('light','sunset alarm fired for zone 3');
						}); 
						
						schedule.scheduleJob('sunriseAlarm3', this.sunrise.toString(), function() {
							led.sendCommands(commands.fullColor.off(3));
							hermes.log('light','sunrise alarm fired for zone 3');
						});
						break;
					case 4:
						schedule.scheduleJob('sunsetAlarm4', this.sunset.toString(), function(){
							led.sendCommands(commands.fullColor.on(4));
							hermes.log('light','sunset alarm fired for zone 4');
						}); 
						
						schedule.scheduleJob('sunriseAlarm4', this.sunrise.toString(), function() {
							led.sendCommands(commands.fullColor.off(4));
							hermes.log('light','sunrise alarm fired for zone 4');
						});
						break;																		
				}
			}
			else {
				if(schedule.scheduleJob("sunriseAlarm"+zone)) {
					schedule.scheduleJob("sunriseAlarm"+zone).cancel();
					hermes.log('light','sunrise synchronisation cancelled for zone '+zone);
				}
				if(schedule.scheduleJob("sunsetAlarm"+zone)) {
					schedule.scheduleJob("sunsetAlarm"+zone).cancel();
					hermes.log('light','sunset synchronisation cancelled for zone '+zone);
				}
			}
		}
	},
	change: function(zone, action) {
		syncs = fs.readFileSync('./json/sync.json');
		syncs = JSON.parse(syncs);
		syncs[zone]['action'] = action;
		fs.writeFileSync('./json/sync.json', JSON.stringify(syncs));
		hermes.log('light','daytime sync for zone '+zone+' written to sync.json');
	}
}

var light = {
	set: function(zone, action) {
		lamps = fs.readFileSync('./json/light.json');
		lamps = JSON.parse(lamps);
	    if (Number(action)) {
	    	lighting2.switchOn(lamps[zone]['id']);
			hermes.log('light','RFXcom switch on '+zone);
	    }
	    else {
	    	lighting2.switchOff(lamps[zone]['id']);
			hermes.log('light','RFXcom switch off '+zone);
	    }
	},
	change: function(zone, action) {
		lamps = fs.readFileSync('./json/light.json');
		lamps = JSON.parse(lamps);
		lamps[zone]['action'] = action;
		fs.writeFileSync('./json/light.json', JSON.stringify(lamps));
		hermes.log('light','wrote lamp positions to sync.json');
	}
}

var weather = {
	region: "",
	rainFallLast24Hour: "",
	maxTemp: "",
	d0RainChance: "",
	d1RainChance: "",
	d2RainChance: "",
	dataBase: "",
	loadDataBase: function() {
		dataBase = fs.readFileSync('./json/weather.json');
		weather.dataBase = JSON.parse(dataBase);
	},
	saveDataBase: function() {
		fs.writeFileSync('./json/weather.json', JSON.stringify(weather.dataBase));
	},
	scrapeRainFall: function(callback1, callback2, callback3) {
		https.get(settings.buienRadarURL, function(scrape) {
			body = '';
			scrape.on('data', function(chunk) {
				body += chunk;
			});
			scrape.on('end', function() {
				data = JSON.parse(body);
				data.actual.stationmeasurements.forEach( function(element, index) {
					if(element.regio === weather.region) {
						hermes.log('app','Scraped rainfall of last 24 hours');
						weather.rainFallLast24Hour = element.rainFallLast24Hour;
						callback1(callback2, callback3);
					}
				});
			})
		});
	},
	scrapeMaxTemperature: function(callback2, callback3) {
		https.get(settings.weerOnlineURL, function(scrape) {
			body = '';
			scrape.on('data', function(chunk) {
				body += chunk;
			});
			scrape.on('end', function() {
				data = JSON.parse(body);
				weather.maxTemp = Number(data.liveweer[0].d0tmax);
				weather.d0RainChance = Number(data.liveweer[0].d0neerslag);
				weather.d1RainChance = Number(data.liveweer[0].d1neerslag);
				weather.d2RainChance = Number(data.liveweer[0].d2neerslag)
				hermes.log('app','Scraped maximum temperature and the rainfall chances of today, tomorrow and the day after tomorrow');
				callback2(callback3);
			})
		});	
	},
	upDateWeatherDataBase: function(callback3) {
		weather.loadDataBase();
		dB = weather.dataBase;
		dmin0 = {
			date: new Date,
			maxTemp: weather.maxTemp,
			rainFallLast24Hour: weather.rainFallLast24Hour,
			d0RainChance: weather.d0RainChance,
			d1RainChance: weather.d1RainChance,
			d2RainChance: weather.d2RainChance
		};
		weather.dataBase = { 
			"dmin0": dmin0,
			"dmin1": dB['dmin0'], 
			"dmin2": dB['dmin1'],
			"dmin3": dB['dmin2'],
			"dmin4": dB['dmin3']
		};
		hermes.log('app','Saved weather forecast to database');
		weather.saveDataBase();
		callback3();
	}
}

var sprinkler = {
	sprinkleDay1: Number(settings.sprinkleDay1),
	sprinkleDay2: Number(settings.sprinkleDay2),
	rainChanceThreshold: Number(settings.rainChanceThreshold),
	weather: "",
	loadWeather: function() {
		weather = fs.readFileSync("./json/weather.json");
		sprinkler.weather = JSON.parse(weather);
	},
	checkTemp: function() {
		var maxTempLast120hour = (sprinkler.weather['dmin0'].maxTemp + sprinkler.weather['dmin1'].maxTemp + sprinkler.weather['dmin2'].maxTemp + sprinkler.weather['dmin3'].maxTemp + sprinkler.weather['dmin4'].maxTemp) / 5;
		if (maxTempLast120hour < 15) {
			return 0;
		}
		else if(maxTempLast120hour < 20) {
			return 1;
		}
		else if(maxTempLast120hour < 25) {
			return 2;
		}
		else if(maxTempLast120hour < 30) {
			return 3;
		}
		else if(maxTempLast120hour < 35) {
			return 4;
		}
		else if(maxTempLast120hour < 40) {
			return 5;
		}
		else if(maxTempLast120hour > 39) {
			return 6;
		} 
		else {
			return false;
		}
	},
	checkRainFall: function() {
		var rainFallLast120hour = sprinkler.weather['dmin0'].rainFallLast24Hour + sprinkler.weather['dmin1'].rainFallLast24Hour + sprinkler.weather['dmin2'].rainFallLast24Hour + sprinkler.weather['dmin3'].rainFallLast24Hour + sprinkler.weather['dmin4'].rainFallLast24Hour;
		if (rainfallLast120hour === 0) {
			return 6;
		}
		else if(rainfallLast120hour < 3) {
			return 5;
		}
		else if(rainfallLast120hour < 5) {
			return 4;
		}
		else if(rainfallLast120hour < 7) {
			return 3;
		}
		else if(rainfallLast120hour < 10) {
			return 2;
		}
		else if(rainfallLast120hour < 15) {
			return 1;
		}
		else if(rainFallLast120hour > 14) {
			return 0;
		}
		else {
			return false;
		}
	},
	checkRainChance: function() {
		if (sprinkler.weather['dmin0'].d0RainChance > weather.rainChanceThreshold || sprinkler.weather['dmin0'].d1RainChance > weather.rainChanceThreshold) {
			return true;
		}
		else {
			return false;
		}
	},
	calcDuration: function() {
		droughtScore = sprinkler.checkRainFall() * sprinkler.checkTemp();
		if (droughtScore >29) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 90
				},
				2: {
					zone: 2,
					duration: 90
				},
				5: {
					zone: 5,
					duration: 90
				},
				3: {
					zone: 3,
					duration: 180
				},
				4: {
					zone: 4,
					duration: 180
				}
			}
			return sprinkleTime;
		}
		else if (droughtScore>23) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 60
				},
				2: {
					zone: 2,
					duration: 60
				},
				5: {
					zone: 5,
					duration: 60
				},
				3: {
					zone: 3,
					duration: 120
				},
				4: {
					zone: 4,
					duration: 120
				}
			}
			return sprinkleTime;
		}
		else if (droughtScore>19) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 45
				},
				2: {
					zone: 2,
					duration: 45
				},
				5: {
					zone: 5,
					duration: 45
				},
				3: {
					zone: 3,
					duration: 90
				},
				4: {
					zone: 4,
					duration: 90
				}
			}
			return sprinkleTime;
		}
		else if (droughtScore>14) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 30
				},
				2: {
					zone: 2,
					duration: 30
				},
				5: {
					zone: 5,
					duration: 30
				},
				3: {
					zone: 3,
					duration: 60
				},
				4: {
					zone: 4,
					duration: 60
				}
			}
			return sprinkleTime;
		}
		else if (droughtScore>10) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 20
				},
				2: {
					zone: 2,
					duration: 20
				},
				5: {
					zone: 5,
					duration: 20
				},
				3: {
					zone: 3,
					duration: 30
				},
				4: {
					zone: 4,
					duration: 30
				}
			}
			return sprinkleTime;
		}
		else if (droughtScore>5) {
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 10
				},
				2: {
					zone: 2,
					duration: 10
				},
				5: {
					zone: 5,
					duration: 10
				},
				3: {
					zone: 3,
					duration: 15
				},
				4: {
					zone: 4,
					duration: 15
				}
			}
			return sprinkleTime;
		}
		else { 
			var sprinkleTime = {
				1: {
					zone: 1,
					duration: 0
				},
				2: {
					zone: 2,
					duration: 0
				},
				5: {
					zone: 5,
					duration: 0
				},
				3: {
					zone: 3,
					duration: 0
				},
				4: {
					zone: 4,
					duration: 0
				}
			}
			return sprinkleTime;
		}
	},
	run: function() {
		today = new Date;
		sprinkler.loadWeather();
		if (today.getDay() === sprinkler.sprinkleDay1 || today.getDay() === sprinkler.sprinkleDay2) {
			if (sprinkler.checkRainChance()) {
				hermes.log('sprinkler','Rain is coming, sprinkling system will not activate');			
				return;
			}
			else {
				sprinkleTime = sprinkler.calcDuration();
				pump.timer(sprinkleTime);
				hermes.log('sprinkler',"Period of drought, sprinkling system will activate");
				return;
			}			
		}
		else {
			hermes.log('sprinkler',"No sprinkling today")
		} 
	}
}

//
//Boot the nodejs server
//
//Start logger
hermes.log('\n');
hermes.log('app','DEBLINDOMOTIX BOOTING')
//Start the express framework
app = express();
//Load the webapp at port 5050
app.listen(Number(settings.port), function() {
	hermes.log('app',"DeblinDomotix webserver running on "+settings.localhost+" @ port "+settings.port);
});
//Serve all webcontent
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('icon'));
//server html index file @localhost:5050
app.get('/', function(req, res) {
	res.sendFile(__dirname+'/index.html')
	hermes.log('app',"Web request from "+req.connection.remoteAddress);
});
//Start the bodyparser module
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialising the rfxcom
var rfxtrx = new rfxcom.RfxCom('/dev/ttyUSB0', {debug: true}),
lighting2 = new rfxcom.Lighting2(rfxtrx, rfxcom.lighting2.HOMEEASY_EU);

hermes.log('app','Initialising RFXcom...');
//Router for POST request within rfxcom initialising function
rfxtrx.initialise(function() { 

	hermes.log('app','RFXcom initialised');
	
	//intialise sunrise/sunset syncing
	daytimeSync.get(function() {
		daytimeSync.set();
	});

	//Initialising Smart Sprinkling System
	hermes.log('sprinkler','Initialising Smart Sprinkling System...');
	hermes.log('sprinkler','Smart Sprinkling System will run @ 6:00');
	schedule.scheduleJob('weatherScrape','0 6 * * *', function() {
		weather.region = settings.region;
		weather.scrapeRainFall(weather.scrapeMaxTemperature, weather.upDateWeatherDataBase, sprinkler.run);
	});

	app.post('/', function (req, res) {
        switch (req.body.device) {
        	case 'log':
        		log = fs.readFileSync('./log/'+req.body.book+'.log','UTF-8');
        		res.send(log);
        		break;
        	case 'rfxcom':
	       		light.change(req.body.zone, req.body.action);
	       		light.set(req.body.zone, req.body.action);
	       		res.end();
        		break;
        	case 'relay':
        		pump.change(req.body.zone, req.body.action);
        		pump.set(req.body.zone, req.body.action);
	       		res.end();
    			break;
    		case 'daytimeSync':
				daytimeSync.change(req.body.zone, req.body.action);
				daytimeSync.get(function() {
					daytimeSync.set();
				});
    	   		res.end();
    	   		break;
	    	case 'switches':
	    		switch (req.body.kind) {
	    			case 'light':
	    				lamps = fs.readFileSync('./json/light.json');
	    				lamps = JSON.parse(lamps);
	    				res.send(lamps[req.body.zone]['action']);
	    				break;
	    			case 'sync':
	    				syncs = fs.readFileSync('./json/sync.json');
	    				syncs = JSON.parse(syncs);
	    				res.send(syncs[req.body.zone]['action']);
	    				break;
	    			case 'pump':
	    				pumps = fs.readFileSync('./json/pump.json');
	    				pumps = JSON.parse(pumps);
	    				res.send(pumps[req.body.zone]['action']);
	    				break;
	    		}
    	}
    });

    rfxtrx.on("lighting2", function(evt) {
		if(evt.id === 0x1DF6D7A) {

			date = new Date();
			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'studio.emrys@gmail.com',
			    pass: 'Jortijntheole@19'
			  }
			});

			var mailOptions = {
			  from: 'studio.emrys@gmail.com',
			  to: 'merlijnschoots@gmail.com; debbiecamron@gmail.com',
			  subject: 'Ding Dong',
			  text: 'De deurbel ging om: '+date.toString()
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    hermes.log('app',error);
			  } else {
			    hermes.log('app','Email sent: ' + info.response);
			  }
			}); 
		}
	});
});