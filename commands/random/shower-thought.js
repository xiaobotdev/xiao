const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class ShowerThoughtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shower-thought',
			aliases: ['shower-thoughts'],
			group: 'random',
			memberName: 'shower-thought',
			description: 'Responds with a random shower thought, directly from r/Showerthoughts.'
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('https://www.reddit.com/r/Showerthoughts.json')
				.query({ limit: 1000 });
			const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
			if (!allowed.length) return msg.say('Hmm... It seems the thoughts are all gone right now. Try again later!');
			return msg.say(allowed[Math.floor(Math.random() * allowed.length)].data.title);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
