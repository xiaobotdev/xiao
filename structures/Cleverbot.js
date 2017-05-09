const request = require('superagent');

class Cleverbot {
    constructor(options) {
        this.key = options.key;
        this.user = options.user;
        this.nick = options.nick;
    }

	create() {
        return request
            .post('https://cleverbot.io/1.0/create')
            .send({
                user: this.user,
                key: this.key,
                nick: this.nick
            });
	}

	ask(text) {
	    return request
	        .post('https://cleverbot.io/1.0/ask')
	        .send({
	            user: this.user,
	            key: this.key,
	            nick: this.nick,
	            text
	        });
	}
}

module.exports = Cleverbot;
