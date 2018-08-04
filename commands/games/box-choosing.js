const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const script = require('../../assets/json/box-choosing');

module.exports = class BoxChoosingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'box-choosing',
			aliases: ['box-choose', 'boxes'],
			group: 'games',
			memberName: 'box-choosing',
			description: 'Do you believe that there are choices in life? Taken from Higurashi Chapter 4.'
		});

		this.playing = new Set();
		this.blue = new Set();
		this.red = new Set();
	}

	async run(msg) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			let i = 0;
			let path = 'before';
			while (true) { // eslint-disable-line no-constant-condition
				const line = script[path][i];
				if (line.end) {
					this.playing.delete(msg.channel.id);
					return msg.say(line.text);
				} else {
					await msg.say(typeof line === 'object' ? line.text : stripIndents`
						${line}

						_Proceed?_
					`);
				}
				if (line.options) {
					const filter = res => res.author.id === msg.author.id && line.options.includes(res.content.toLowerCase());
					const choose = await msg.channel.awaitMessages(filter, {
						max: 1,
						time: 120000
					});
					if (!choose.size) break;
					path = '';
					const pick = line.paths[line.options.indexOf(choose.first().content.toLowerCase())];
					if ((this.red.has(msg.author.id) && pick !== 'red') || (this.blue.has(msg.author.id) && pick !== 'blue')) {
						path += 'both';
						if (this.red.has(msg.author.id)) this.red.delete(msg.author.id);
						if (this.blue.has(msg.author.id)) this.blue.delete(msg.author.id);
					} else {
						this[pick].add(msg.author.id);
						setTimeout(() => { if (this[pick].has(msg.author.id)) this[pick].delete(msg.author.id); }, 600000);
					}
					path += pick;
					i = 0;
				} else {
					const verification = await verify(msg.channel, msg.author, 120000);
					if (!verification) break;
					i++;
				}
			}
			this.playing.delete(msg.channel.id);
			return msg.say('See you soon!');
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}
};
