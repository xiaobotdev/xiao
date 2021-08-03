const { Message, MessagePayload, APIMessage } = require('discord.js');

Reflect.defineProperty(Message.prototype, 'say', { value: function (content, options) {
	if (typeof content === 'object') return this.channel.send(content);
	return this.channel.send({ content, ...options });
} });

Reflect.defineProperty(Message.prototype, 'embed', { value: function (embed, options) {
	return this.channel.send({ embeds: [embed], ...options });
} });

Reflect.defineProperty(Message.prototype, 'code', { value: function (lang, content, options) {
	return this.channel.send({ content, lang, ...options });
} });

Reflect.defineProperty(Message.prototype, 'direct', { value: function (content, options) {
	if (typeof content === 'object') return this.author.send(content);
	return this.author.send({ content, options });
} });
