var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbprop = require('./server/properties/db-properties');

if(app.get('env') == 'development')
	process.env.NODE_ENV = 'development';
		else
			process.env.NODE_ENV = 'production';




app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'html');
app.set('view cache', true);

app.engine('html', require('ejs').renderFile);

/*
  Defining App use
 */
 app.use(cookieParser());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(__dirname + '/public')); //Defines public folder files as static (css,js,img..)

 	dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);
 	var dbHost = dbprop['app'].dbHost;
 	var dbPort = dbprop.dbPort;
 	var dbName = dbprop.dbName;

 	//TODO
 	var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
 	if (app.get('env') == 'production'){
 	dbURL = 'mongodb://devel:vivaeta@ds021036.mlab.com:21036/ikariam';
 	}

 	//TODO: Opens session
 	app.use(session({
 	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
 	proxy: true,
 	resave: true,
 	saveUninitialized: true,
 	store: new MongoStore({ url: dbURL })
 	})
 	);
 //Module of routes conf
 require('./server/routes/routes')(app);

//Starts server
 var server = require('http').createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
