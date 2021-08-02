const { Message, MessagePayload, APIMessage } = require('discord.js');

Reflect.defineProperty(Message.prototype, 'say', { value: function (content, options) {
	return this.channel.send({ content: content || null, ...options });
} });

Reflect.defineProperty(Message.prototype, 'embed', { value: function (embed, options) {
	return this.channel.send({ embeds: [embed], ...options });
} });

Reflect.defineProperty(Message.prototype, 'code', { value: function (lang, content, options) {
	return this.channel.send({ content: content || null, lang, ...options });
} });

Reflect.defineProperty(Message.prototype, 'direct', { value: function (content, options) {
	return this.author.send({ content: content || null, options });
} });
