const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Aki = require('aki-api');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			aliases: ['aki'],
			group: 'games-sp',
			memberName: 'akinator',
			description: 'Think about a real or fictional character, I will try to guess who it is.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Akinator',
					url: 'https://en.akinator.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			const aki = new Aki('en');
			let ans = null;
			let win = false;
			let forceGuess = false;
			this.client.games.set(msg.channel.id, { name: this.name });
			while (!aki.guessCount || aki.guessCount < 3) {
				if (aki.progress >= 70 || forceGuess) {
					await aki.win();
					const guess = aki.answers[0];
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
						const exMsg = aki.guessCount <= 3 || forceGuess ? 'I give up.' : 'I can keep going!';
						await msg.say(`Hmm... Is that so? ${exMsg}`);
						if (aki.guessCount <= 3 || forceGuess) {
							win = true;
							break;
						}
					}
				}
				if (ans === null) await aki.start();
				else await aki.step(ans);
				if (!aki.answers || aki.currentStep >= 80) {
					forceGuess = true;
					continue;
				};
				const answers = aki.answers.map(answer => answer.toLowerCase());
				answers.push('end');
				await msg.say(stripIndents`
					**${++aki.currentStep + 1}.** ${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)
					${aki.answers.join(' | ')}
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
