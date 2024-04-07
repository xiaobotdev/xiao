const Command = require('../../framework/Command');
const { DataResolver, Routes } = require('discord.js');

module.exports = class BannerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'banner',
			group: 'util',
			memberName: 'banner',
			description: 'Sets the bot\'s banner.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'image',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { image }) {
		await this.client.rest.patch(Routes.user(), {
			body: { banner: await DataResolver.resolveImage(image) }
		});
		return msg.say('Set the banner.');
	}
};
