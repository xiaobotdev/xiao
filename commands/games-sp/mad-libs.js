const Command = require('../../structures/Command');
const libs = require('../../assets/json/mad-libs');

module.exports = class MadLibsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mad-libs',
			aliases: ['mad-takes'],
			group: 'games-sp',
			memberName: 'mad-libs',
			description: 'Choose words that fill in the blanks to create a crazy story!',
			credit: [
				{
					name: 'Mad Libs',
					url: 'http://www.madlibs.com/',
					reason: 'Original Game'
				},
				{
					name: 'Mad:)Takes',
					url: 'https://www.madtakes.com/index.php',
					reason: 'Mad Libs Data'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const lib = libs[Math.floor(Math.random() * libs.length)];
			const choices = [];
			for (const word of lib.needed) {
				await msg.reply(`Give me a **${word}**.`);
				const filter = res => {
					if (res.author.id !== msg.author.id) return false;
					if (!res.content || res.content.length > 12) {
						msg.reply('Please only use a maximum of 12 characters per word.').catch(() => null);
						return false;
					}
					return true;
				};
				const choice = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 120000
				});
				if (!choice.size) break;
				choices.push(choice.first().content);
			}
			this.client.games.delete(msg.channel.id);
			let finished = lib.text;
			for (let i = 0; i < choices.length; i++) {
				finished = finished.replaceAll(`{${i}}`, `**${choices[i]}**`);
			}
			return msg.say(finished);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
