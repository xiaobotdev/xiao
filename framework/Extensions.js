const { Message, APIMessage } = require('discord.js');

Reflect.defineProperty(Message.prototype, 'say', { value: function (content, options) {
	return this.channel.send(content, options);
} });

Reflect.defineProperty(Message.prototype, 'embed', { value: function (embed, options) {
	return this.channel.send(new APIMessage(this.channel, { embed, ...options }));
} });

Reflect.defineProperty(Message.prototype, 'code', { value: function (lang, content, options) {
	return this.channel.send(content, { code: lang, ...options });
} });

Reflect.defineProperty(Message.prototype, 'direct', { value: function (content, options) {
	return this.author.send(content, options);
} });
