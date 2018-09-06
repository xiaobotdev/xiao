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
				.get('https://www.reddit.com/r/Showerthoughts/top.json')
				.query({
					sort: 'top',
					t: 'day',
					limit: 100
				});
			const posts = body.data.children.filter(post => post.data && (msg.channel.nsfw ? true : !post.data.over_18));
			if (!posts.length) return msg.say('Hmm... It seems the thoughts are all gone right now. Try again later!');
			return msg.say(posts[Math.floor(Math.random() * posts.length)].data.title);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
