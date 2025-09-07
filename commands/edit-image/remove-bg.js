const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { REMOVEBG_KEY } = process.env;

module.exports = class RemoveBgCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove-bg',
			aliases: ['remove-background'],
			group: 'edit-image',
			description: 'Removes the background from an image.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			throttling: {
				usages: 1,
				duration: 120
			},
			credit: [
				{
					name: 'remove.bg',
					url: 'https://www.remove.bg/',
					reason: 'API',
					reasonURL: 'https://www.remove.bg/api'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 2048, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request
				.post('https://api.remove.bg/v1.0/removebg')
				.set({ 'X-Api-Key': REMOVEBG_KEY })
				.send({
					size: 'auto',
					image_url: image,
					format: 'png'
				});
			return msg.say({ files: [{ attachment: body, name: 'remove-bg.png' }] });
		} catch (err) {
			if (err.status === 400) return msg.reply('Something is wrong with your image.');
			if (err.status === 402) return msg.reply('Sorry! I\'m out of credits. Try again next month!');
			if (err.status === 429) return msg.reply('Sorry, I\'m overloaded. Try again later!');
			throw err;
		}
	}
};
