const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { readFile } = require('fs/promises');
const path = require('path');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;

module.exports = class SpaghettiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spaghetti',
			aliases: ['spaghet', 'pasta', 'spaghettify'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but as spaghetti.',
			throttling: {
				usages: 1,
				duration: 120
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'reiinakano',
					url: 'https://github.com/reiinakano',
					reason: 'Tensorflow Models',
					reasonURL: 'https://github.com/reiinakano/arbitrary-image-stylization-tfjs/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					maxAttachmentSize: 2e+6,
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const style = await readFile(path.join(__dirname, '..', '..', 'assets', 'images', 'spaghetti.jpg'));
		await reactIfAble(msg, msg.author, LOADING_EMOJI_ID, '💬');
		const attachment = await this.client.tensorflow.stylizeImage(body, style);
		await reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'spaghetti.jpg' }] });
	}
};
