const Command = require('../../framework/Command');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { Aki, regions } = require('aki-api');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			aliases: ['aki'],
			group: 'games-sp',
			memberName: 'akinator',
			description: 'Think about a real or fictional character, I will try to guess who it is.',
			details: `**Regions:** ${regions.join(', ')}`,
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
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
					type: 'string',
					default: 'en',
					oneOf: regions,
					parse: region => region.toLowerCase()
				}
			]
		});
	}

	async run(msg, { region }) {
		const aki = new Aki({ region, childMode: !msg.channel.nsfw });
		let ans = null;
		let win = false;
		let timesGuessed = 0;
		let guessResetNum = 0;
		let wentBack = false;
		let forceGuess = false;
		const initialRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('true').setLabel('Ready!').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('false').setLabel('Nevermind').setStyle(ButtonStyle.Secondary)
		);
		const gameMsg = await msg.reply({
			content: 'Welcome to Akinator! Think of a character, and I will try to guess it.',
			components: [initialRow]
		});
		let buttonPress;
		try {
			buttonPress = await gameMsg.awaitMessageComponent({
				filter: res => res.user.id === msg.author.id,
				max: 1,
				time: 30000
			});
			if (buttonPress.customId === 'false') return buttonPress.update({ content: 'Too bad...', components: [] });
		} catch {
			return gameMsg.edit({ content: 'Guess you didn\'t want to play after all...', components: [] });
		}
		await this.sendLoadingMessage(buttonPress, [initialRow]);
		const guessBlacklist = [];
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
			const row = new ActionRowBuilder();
			for (const answer of aki.answers) {
				row.addComponents(new ButtonBuilder().setCustomId(answer).setStyle(ButtonStyle.Primary).setLabel(answer));
			}
			const sRow = new ActionRowBuilder();
			if (aki.currentStep > 0) {
				sRow.addComponents(new ButtonBuilder().setCustomId('back').setStyle(ButtonStyle.Secondary).setLabel('Back'));
			}
			sRow.addComponents(new ButtonBuilder().setCustomId('end').setStyle(ButtonStyle.Danger).setLabel('End'));
			await buttonPress.editReply({
				content: `**${aki.currentStep + 1}.** ${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)`,
				components: [row, sRow],
				embeds: []
			});
			try {
				buttonPress = await gameMsg.awaitMessageComponent({
					filter: res => res.user.id === msg.author.id,
					max: 1,
					time: 30000
				});
			} catch {
				win = 'time';
				break;
			}
			await this.sendLoadingMessage(buttonPress, [row, sRow]);
			const choice = buttonPress.customId;
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
				const embed = new EmbedBuilder()
					.setColor(0xF78B26)
					.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
					.setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ''}`)
					.setThumbnail(guess.absolute_picture_path || null)
					.setFooter({ text: forceGuess ? 'Final Guess' : `Guess ${timesGuessed}` });
				const guessRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId('true').setLabel('Yes').setStyle(ButtonStyle.Success),
					new ButtonBuilder().setCustomId('false').setLabel('No').setStyle(ButtonStyle.Danger)
				);
				await buttonPress.editReply({
					content: 'Is this your character?',
					embeds: [embed],
					components: [guessRow]
				});
				try {
					buttonPress = await gameMsg.awaitMessageComponent({
						filter: res => res.user.id === msg.author.id,
						max: 1,
						time: 30000
					});
				} catch {
					win = 'time';
					break;
				}
				await this.sendLoadingMessage(buttonPress, [guessRow]);
				if (buttonPress.customId === 'true') {
					win = false;
					break;
				} else if (timesGuessed >= 3 || forceGuess) {
					win = true;
					break;
				}
			}
		}
		const row = new ActionRowBuilder();
		row.addComponents(
			new ButtonBuilder().setLabel('Akinator Website').setStyle(ButtonStyle.Link).setURL('https://akinator.com/')
		);
		if (win === 'time') {
			return buttonPress.editReply({ content: 'I guess your silence means I have won.', components: [row] });
		}
		if (win) {
			return buttonPress.editReply({ content: 'Bravo, you have defeated me.', components: [row] });
		}
		return buttonPress.editReply({
			content: 'Guessed right one more time! I love playing with you!',
			components: [row]
		});
	}

	sendLoadingMessage(buttonPress, rows) {
		for (const row of rows) {
			for (const button of row.components) {
				button.setDisabled(true);
			}
		}
		return buttonPress.update({ content: 'Loading...', components: rows });
	}
};
