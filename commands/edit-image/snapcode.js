const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class SnapcodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'snapcode',
			aliases: ['snapchat'],
			group: 'edit-image',
			memberName: 'snapcode',
			description: 'Responds with the Snapcode of a Snapchat user.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Snapchat',
					url: 'https://www.snapchat.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'username',
					prompt: 'What user do you want to get the Snapcode for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { username }) {
		try {
			const { body } = await request
				.get('https://feelinsonice.appspot.com/web/deeplink/snapcode')
				.query({
					username,
					type: 'PNG',
					size: 320
				});
			return msg.say({ files: [{ attachment: body, name: 'snapcode.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
