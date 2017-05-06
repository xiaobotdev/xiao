const request = require('superagent');

class Cleverbot {
	create() {
		request
		    .post('https://cleverbot.io/1.0/create')
		    .send({
		        user: process.env.CLEVS_USER,
		        key: process.env.CLEVS_KEY,
		        nick: process.env.CLEVS_NICK
		    })
			.then(response => console.log(`[Cleverbot] Created with nick: ${response.body.nick}`))
			.catch(err => console.error(`[Cleverbot] Failed to create: ${err}`));
	}
}

module.exports = Cleverbot;
