const Command = require('../../framework/Command');
const { GuildEmoji, PermissionFlagsBits } = require('discord.js');
const twemoji = require('@twemoji/parser');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');

module.exports = class EmojiImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-image',
			aliases: ['big-emoji', 'emote-image', 'big-emote', 'emoji-img', 'emote-img', 'emoji', 'emote'],
			group: 'info',
			memberName: 'emoji-image',
			description: 'Responds with an emoji\'s full-scale image.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'emoji',
					type: 'custom-emoji|default-emoji'
				}
			]
		});
	}

	async run(msg, { emoji }) {
		if (emoji instanceof GuildEmoji) return msg.say({ files: [emoji.url] });
		const parsed = twemoji.parse(emoji);
		if (!parsed.length || !parsed[0].url) return msg.reply('This emoji is not yet supported.');
		const { body } = await request.get(parsed[0].url);
		const emojiImage = await loadImage(body);
		if (parsed[0].url.endsWith('svg')) {
			emojiImage.width = 512;
			emojiImage.height = 512;
		}
		const canvas = createCanvas(512, 512);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(emojiImage, 0, 0, 512, 512);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'emoji-image.png' }] });
	}
};
