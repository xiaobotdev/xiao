const Command = require('../../structures/Command');

module.exports = class BottomTextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bottom-text',
			group: 'edit-meme',
			memberName: 'bottom-text',
			description: 'Sends a bottom text meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ShareFonts.net',
					url: 'https://www.wfonts.com/',
					reason: 'Impact Font',
					reasonURL: 'https://www.wfonts.com/font/impact'
				}
			],
			args: [
				{
					key: 'top',
					prompt: 'What should the top row of the meme to be?',
					type: 'string',
					max: 50,
					parse: top => top.toUpperCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	run(msg, { top, image }) {
		return this.client.registry.commands.get('meme-gen').run(msg, { top, bottom: 'BOTTOM TEXT', image });
	}
};
