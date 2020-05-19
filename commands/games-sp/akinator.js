const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Aki = require('aki-api');
const { stripIndents } = require('common-tags');
const { list, verify } = require('../../util/Util');
const regions = require('../../assets/json/akinator');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			aliases: ['aki'],
			group: 'games-sp',
			memberName: 'akinator',
			description: 'Think about a real or fictional character, I will try to guess who it is.',
			details: `**Regions:** ${regions.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Akinator',
					url: 'https://en.akinator.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'region',
					prompt: `What region do you want to use? Either ${list(regions, 'or')}.`,
					type: 'string',
					default: 'en',
					oneOf: regions,
					parse: region => region.toLowerCase()
				}
			]
		});
	}

	async run(msg, { region }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			const aki = new Aki(region);
			let ans = null;
			let win = false;
			let timesGuessed = 0;
			let forceGuess = false;
			this.client.games.set(msg.channel.id, { name: this.name });
			while (timesGuessed < 3) {
				if (ans === null) {
					await aki.start();
				} else {
					try {
						await aki.step(ans);
					} catch {
						await aki.step(ans);
					}
				}
				if (!aki.answers || aki.currentStep >= 78) forceGuess = true;
				const answers = aki.answers.map(answer => answer.toLowerCase());
				answers.push('end');
				await msg.say(stripIndents`
					**${aki.currentStep + 1}.** ${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)
					${aki.answers.join(' | ')} | End
				`);
				const filter = res => res.author.id === msg.author.id && answers.includes(res.content.toLowerCase());
				const msgs = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say('Sorry, time is up!');
					win = 'time';
					break;
				}
				if (msgs.first().content.toLowerCase() === 'end') forceGuess = true;
				else ans = answers.indexOf(msgs.first().content.toLowerCase());
				if (aki.progress >= 90 || forceGuess) {
					timesGuessed += 1;
					await aki.win();
					const guess = aki.answers.sort((a, b) => b.proba - a.proba)[0];
					const embed = new MessageEmbed()
						.setColor(0xF78B26)
						.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
						.setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ''}`)
						.setThumbnail(guess.absolute_picture_path || null);
					await msg.embed(embed);
					const verification = await verify(msg.channel, msg.author);
					if (verification === 0) {
						win = 'time';
						break;
					} else if (verification) {
						win = false;
						break;
					} else {
						const exMsg = timesGuessed >= 3 || forceGuess ? 'I give up.' : 'I can keep going!';
						await msg.say(`Hmm... Is that so? ${exMsg}`);
						if (timesGuessed >= 3 || forceGuess) {
							win = true;
							break;
						}
					}
				}
			}
			this.client.games.delete(msg.channel.id);
			if (win === 'time') return msg.say('I guess your silence means I have won.');
			if (win) return msg.say('Bravo, you have defeated me.');
			return msg.say('Guessed right one more time! I love playing with you!');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
