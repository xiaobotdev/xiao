const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');
const { IMGFLIP_USER, IMGFLIP_PASS } = process.env;

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
					default: ' ',
					validate: top => {
						if (top.length < 200) return true;
						return 'Invalid top text, please keep the top text under 200 characters.';
					}
				},
				{
					key: 'bottom',
					prompt: 'What should the bottom row of the meme to be?',
					type: 'string',
					default: ' ',
					validate: bottom => {
						if (bottom.length < 200) return true;
						return 'Invalid bottom text, please keep the bottom text under 200 characters.';
					}
				}
			]
		});
	}

	async run(msg, { type, top, bottom }) {
		try {
			const memes = await snekfetch
				.get('https://api.imgflip.com/get_memes');
			const memeList = memes.body.data.memes;
			if (type === 'list') return msg.say(list(memeList.map(meme => meme.name), 'or'), { split: { char: ' ' } });
			if (!memeList.some(meme => meme.name.toLowerCase() === type)) {
				return msg.say(`Invalid type, please use ${msg.usage('list')}.`);
			}
			const { body } = await snekfetch
				.post('https://api.imgflip.com/caption_image')
				.query({
					template_id: memeList.find(meme => meme.name.toLowerCase() === type).id,
					username: IMGFLIP_USER,
					password: IMGFLIP_PASS,
					text0: top,
					text1: bottom
				});
			return msg.say({ files: [body.data.url] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
