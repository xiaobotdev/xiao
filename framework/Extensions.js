/* eslint-disable */
const { Message, EmbedBuilder } = require('discord.js');

Reflect.defineProperty(Message.prototype, 'say', { value: function (content, options) {
	if (typeof content === 'object') return this.channel.send(content);
	return this.channel.send({ content, ...options });
} });

Reflect.defineProperty(Message.prototype, 'embed', { value: function (embed, options) {
	return this.channel.send({ embeds: [embed], ...options });
} });

Reflect.defineProperty(Message.prototype, 'code', { value: function (lang, content, options) {
	return this.channel.send({ content: `\`\`\`${lang}\n${content}\n\`\`\``, ...options });
} });

Reflect.defineProperty(Message.prototype, 'direct', { value: function (content, options) {
	if (typeof content === 'object') return this.author.send(content);
	return this.author.send({ content, options });
} });

Reflect.defineProperty(Message.prototype, 'reply', { value: function (content, options) {
	if (typeof content === 'object') return this.channel.send(content, { reply: { messageReference: this } });
	return this.channel.send({ content, ...options, reply: { messageReference: this } });
} });

Reflect.defineProperty(EmbedBuilder.prototype, 'addField', { value: function (name, value, inline = false) {
	return this.addFields([{ name, value, inline }]);
} });

Reflect.defineProperty(EmbedBuilder.prototype, 'addBlankField', { value: function (inline = false) {
	return this.addFields([{ name: '\u200b', value: '\u200b', inline }]);
} });
/* eslint-enable */
