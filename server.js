
import Config from 'react-native-config';
import MySQL from 'mysql';
import BodyParser from 'body-parser';

/**
* To run server: enter command "node server.js" or "npx nodemon server.js"
*
* NOTE: This needs to be running for the app to work.
*/

export default class ServerClass {
	constructor() {
		console.log('Starting server object.');
		this.doIt();
	}

	doIt() {
		var express = require('express');
		var mysql = require('mysql');
		var bodyParser = require('body-parser');
	
		var app = express();
		app.use(bodyParser.json({type:'application/json'}));
		app.use(bodyParser.urlencoded({extended:true}));
	
	
		// MySQL database properties
		var con = mysql.createConnection({
			host: Config.server,
			user: Config.username,
			database: Config.dbname,
			password: Config.password,
	
		});
	
	
		// port number can be changed around while testing
		/**var server = app.listen(4549, function() {
			var host = server.address().address
			var port = server.address().port
		});
		**/
	
		con.connect(function(error){
			if(error) console.log(error);
			else console.log("connected");
		});
	
		// fetches most recent values from niceview table. 
		// note that this table came from a dump file which contains data
		// 
	
		/**app.get('/niceview', function(req, res) {
	
			con.query('select Cond, DOpct, Temp, time_stamp from niceview order by time_stamp desc limit 1', function(error, rows, fields) {
				if(error) console.log(error);
				else {
					console.log(rows);
					res.send(rows);
				}
			});
		});
		*/
	}
	
}