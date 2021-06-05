const { Structures } = require('discord.js');

module.exports = Structures.extend('Message', Message => {
	return class CommandMessage extends Message {
		constructor(...args) {
			super(...args);
		}

		say(content, options) {
			return this.channel.send(content, options);
		}

		embed(embed, options) {
			return this.channel.send('', { embed, ...options });
		}

		code(lang, content, options) {
			return this.channel.send(content, { code: lang, ...options });
		}
	}
});
