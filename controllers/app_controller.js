require("babel-polyfill");
const RiveScript = require('rivescript')

//Question model
const Question = require('../models/questions');

// Create the bot.
var bot = new RiveScript();

bot.loadDirectory("./brain")
	.then(function(){
		console.log("Brain loaded!");
		bot.sortReplies();

	})
	.catch(function(loadcount, err){
		console.log("Error loading batch #" + loadcount + ": " + err + "\n");
	});

//api save
const bot_save = (req, res) => {
	//get data from json post
	var pid = req.body.pid
	var message = req.body.message

	// Make sure username and message are included.
	if(pid && message){
		console.log(req.body);
		//save the message to db
		const newQ = new Question({
		  pid: pid,
		  message: message
		});

		newQ.save()
		  .then(function(newQuestionData){
		  	console.log(newQuestionData)
		  })
		  .catch(function(err){console.log(err)});
		  res.end();
	}

}

//api reply
const bot_reply = (req, res) => {
	// Get data from the JSON post.
	var username = req.body.username;
	var message  = req.body.message;
	var vars     = req.body.vars;

	// Make sure username and message are included.
	if (typeof(username) === "undefined" || typeof(message) === "undefined") {
		return error(res, "username and message are required keys");
	}

	// Copy any user vars from the post into RiveScript.
	if (typeof(vars) !== "undefined") {
		for (var key in vars) {
			if (vars.hasOwnProperty(key)) {
				bot.setUservar(username, key, vars[key]);
			}
		}
	}

	// Get a reply from the bot.
	bot.reply(username, message, this).then(function(reply) {
		// Get all the user's vars back out of the bot to include in the response.
		vars = bot.getUservars(username);

		// Send the JSON response.
		res.json({
			"status": "ok",
			"reply": reply,
			"vars": vars
		});
	}).catch(function(err) {
		res.json({
			"status": "error",
			"error": err
		});
	});
}

// index controller
const app_index = (req, res) => {
	res.render('index', {title:"AnteCare", layout: 'layout.hbs', messages: req.flash('newGuestSuccessMsg')});
}

module.exports = {
	app_index,
	bot_reply,
	bot_save
}