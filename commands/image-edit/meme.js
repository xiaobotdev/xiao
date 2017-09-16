const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'image-edit',
			memberName: 'meme',
			description: 'Sends a meme with the text and background of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'type',
					prompt: 'What meme type do you want to use?',
					type: 'string',
					parse: type => type.toLowerCase()
				},
				{
					key: 'top',
					prompt: 'What should the top row of the meme to be?',
					type: 'string',
					default: '_',
					validate: top => {
						if (top.length < 200) return true;
						return 'Invalid top text, please keep the top text under 200 characters.';
					},
					parse: top => encodeURIComponent(top)
				},
				{
					key: 'bottom',
					prompt: 'What should the bottom row of the meme to be?',
					type: 'string',
					default: '_',
					validate: bottom => {
						if (bottom.length < 200) return true;
						return 'Invalid bottom text, please keep the bottom text under 200 characters.';
					},
					parse: bottom => encodeURIComponent(bottom)
				}
			]
		});
	}

	async run(msg, { type, top, bottom }) {
		try {
			if (type === 'list') {
				const { body } = await snekfetch
					.get('https://memegen.link/api/templates/');
				const codes = Object.values(body).map(code => code.replace('https://memegen.link/api/templates/', ''));
				return msg.say(list(codes));
			}
			const { body } = await snekfetch
				.get(`https://memegen.link/api/templates/${type}/${top}/${bottom}`, { followRedirects: true });
			return msg.say({ files: [body.direct.masked] });
		} catch (err) {
			if (err.status === 404) return msg.say(`Invalid meme type, please use ${msg.usage('list')} for a list.`);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
