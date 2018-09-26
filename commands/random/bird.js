const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class BirdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bird',
			aliases: ['birb'],
			group: 'random',
			memberName: 'bird',
			description: 'Responds with a random bird image.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('http://random.birb.pw/tweet.json/');
			return msg.say({ files: [{ attachment: `http://random.birb.pw/img/${body.file}`, name: body.file }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
