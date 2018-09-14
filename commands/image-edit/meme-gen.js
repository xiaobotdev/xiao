const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class MemeGenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme-gen',
			aliases: ['meme-generator', 'create-meme'],
			group: 'image-edit',
			memberName: 'meme-gen',
			description: 'Sends a meme with the text and background of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'type',
					prompt: 'What meme type do you want to use?',
					type: 'string',
					parse: type => encodeURIComponent(type)
				},
				{
					key: 'top',
					prompt: 'What should the top row of the meme to be?',
					type: 'string',
					max: 200,
					parse: top => encodeURIComponent(top)
				},
				{
					key: 'bottom',
					prompt: 'What should the bottom row of the meme to be?',
					type: 'string',
					max: 200,
					parse: bottom => encodeURIComponent(bottom)
				}
			]
		});
	}

	async run(msg, { type, top, bottom }) {
		try {
			const search = await request.get(`https://memegen.link/api/search/${type}`);
			if (!search.body.length) return msg.say('Could not find any results.');
			const { body } = await request.get(search.body[0].template.blank.replace(/\/_/, `/${top}/${bottom}`));
			return msg.say({ files: [{ attachment: body, name: 'meme.jpg' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
