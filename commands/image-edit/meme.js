const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');
const codes = require('../../assets/json/meme');

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'image-edit',
			memberName: 'meme',
			description: 'Sends a meme with the text and background of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			details: `**Codes:** ${codes.join(', ')}`,
			args: [
				{
					key: 'type',
					prompt: `What meme type do you want to use? Either ${list(codes, 'or')}.`,
					type: 'string',
					validate: type => {
						if (codes.includes(type.toLowerCase())) return true;
						return `Invalid meme type, please enter either ${list(codes, 'or')}.`;
					},
					parse: type => type.toLowerCase()
				},
				{
					key: 'top',
					prompt: 'What should the top row of the meme to be?',
					type: 'string',
					validate: top => {
						if (top.length < 200) return true;
						return 'Please keep the top text under 200 characters.';
					},
					parse: top => encodeURIComponent(top)
				},
				{
					key: 'bottom',
					prompt: 'What should the bottom row of the meme to be?',
					type: 'string',
					validate: bottom => {
						if (bottom.length < 200) return true;
						return 'Please keep the bottom text under 200 characters.';
					},
					parse: bottom => encodeURIComponent(bottom)
				}
			]
		});
	}

	async run(msg, args) {
		const { type, top, bottom } = args;
		try {
			const { body } = await snekfetch
				.get(`https://memegen.link/api/templates/${type}/${top}/${bottom}`, { followRedirects: true });
			return msg.say(body.direct.masked);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
