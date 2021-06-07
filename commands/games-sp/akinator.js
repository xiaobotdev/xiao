const Command = require('../../framework/Command');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Aki, regions } = require('aki-api');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');

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
			const aki = new Aki(region, !msg.channel.nsfw);
			let ans = null;
			let win = false;
			let timesGuessed = 0;
			let guessResetNum = 0;
			let wentBack = false;
			let forceGuess = false;
			const initialRow = new MessageActionRow().addComponents(
				new MessageButton().setCustomID('true').setLabel('Ready!').setStyle('PRIMARY'),
				new MessageButton().setCustomID('false').setLabel('Nevermind').setStyle('SECONDARY')
			);
			const gameMsg = await msg.reply('Welcome to Akinator! Think of a character, and I will try to guess it.', {
				components: [initialRow]
			});
			const initialVerify = await gameMsg.awaitMessageComponentInteractions(res => res.user.id === msg.author.id, {
				max: 1,
				time: 30000
			});
			if (!initialVerify.size) {
				return gameMsg.edit('Guess you didn\'t want to play after all...', { components: [] });
			}
			let buttonPress = initialVerify.first();
			if (buttonPress.customID === 'false') return buttonPress.update('Too bad...', { components: [] });
			const guessBlacklist = [];
			this.client.games.set(msg.channel.id, { name: this.name });
			while (timesGuessed < 3) {
				if (guessResetNum > 0) guessResetNum--;
				if (ans === null) {
					await aki.start();
				} else if (wentBack) {
					wentBack = false;
				} else {
					try {
						await aki.step(ans);
					} catch {
						await aki.step(ans);
					}
				}
				if (!aki.answers || aki.currentStep >= 79) forceGuess = true;
				const row = new MessageActionRow();
				for (const answer of aki.answers) {
					row.addComponents(new MessageButton().setCustomID(answer).setStyle('PRIMARY').setLabel(answer));
				}
				if (aki.currentStep > 0) {
					row.addComponents(new MessageButton().setCustomID('back').setStyle('SECONDARY').setLabel('Back'));
				}
				row.addComponents(new MessageButton().setCustomID('end').setStyle('DANGER').setLabel('End'));
				await buttonPress.update(stripIndents`
					**${aki.currentStep + 1}.** ${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)
					${aki.answers.join(' | ')}${aki.currentStep > 0 ? ` | Back` : ''} | End
				`, { components: [row] });
				const interactions = await gameMsg.awaitMessageComponentInteractions(res => res.user.id === msg.author.id, {
					max: 1,
					time: 30000
				});
				if (!interactions.size) {
					win = 'time';
					break;
				}
				buttonPress = interactions.first();
				const choice = interactions.first().customID;
				if (choice === 'end') {
					forceGuess = true;
				} else if (choice === 'back') {
					if (guessResetNum > 0) guessResetNum++;
					wentBack = true;
					await aki.back();
					continue;
				} else {
					ans = aki.answers.indexOf(choice);
				}
				if ((aki.progress >= 90 && !guessResetNum) || forceGuess) {
					timesGuessed++;
					guessResetNum += 10;
					await aki.win();
					const guess = aki.answers.filter(g => !guessBlacklist.includes(g.id))[0];
					if (!guess) {
						win = true;
						break;
					}
					guessBlacklist.push(guess.id);
					const embed = new MessageEmbed()
						.setColor(0xF78B26)
						.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
						.setDescription(stripIndents`
							${guess.name}${guess.description ? `\n_${guess.description}_` : ''}

							_**Type [y]es or [n]o to continue.**_
						`)
						.setThumbnail(guess.absolute_picture_path || null)
						.setFooter(forceGuess ? 'Final Guess' : `Guess ${timesGuessed}`);
					const guessRow = new MessageActionRow().addComponents(
						new MessageButton().setCustomID('true').setLabel('Yes').setStyle('SUCCESS'),
						new MessageButton().setCustomID('false').setLabel('No').setStyle('DANGER')
					);
					await buttonPress.update('Is this your character?', { embed, components: [guessRow] });
					const verification = await gameMsg.awaitMessageComponentInteractions(res => res.user.id === msg.author.id, {
						max: 1,
						time: 30000
					});
					if (!verification.size) {
						win = 'time';
						break;
					}
					const guessResult = verification.first();
					if (guessResult.customID === 'true') {
						win = false;
						break;
					} else if (timesGuessed >= 3 || forceGuess) {
						win = true;
						break;
					}
				}
			}
			this.client.games.delete(msg.channel.id);
			if (win === 'time') return buttonPress.update('I guess your silence means I have won.', { components: [] });
			if (win) return buttonPress.update('Bravo, you have defeated me.', { components: [] });
			return buttonPress.update('Guessed right one more time! I love playing with you!', { components: [] });
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
