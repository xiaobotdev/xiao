const Command = require('../../framework/Command');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { Akinator, regions } = require('../../structures/Akinator');

module.exports = class AkinatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'akinator',
			aliases: ['aki'],
			group: 'games-sp',
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
		const aki = new Akinator(region, !msg.channel.nsfw);
		let ans = null;
		let win = false;
		let wentBack = false;
		let guessedLastTurn = false;
		let timesGuessed = 0;
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
		while (aki.akiWin === null) {
			if (ans === null) {
				await aki.start();
			} else if (wentBack) {
				wentBack = false;
			} else if (guessedLastTurn) {
				guessedLastTurn = false;
			} else {
				await aki.step(ans);
			}
			if (!aki.question) {
				win = false;
				break;
			} else if (aki.guessed) {
				const guess = aki.guessed;
				timesGuessed++;
				const embed = new EmbedBuilder()
					.setColor(0xF78B26)
					.setTitle(`I'm ${Math.round(aki.progress)}% sure it's...`)
					.setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ''}`)
					.setThumbnail(guess.photo || null)
					.setFooter({ text: `Guess ${timesGuessed}` });
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
					await aki.guess(true, false);
					win = false;
					break;
				} else if (buttonPress.customId === 'false') {
					await aki.guess(false, true);
					guessedLastTurn = true;
				}
			} else {
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
					break;
				} else if (choice === 'back') {
					wentBack = true;
					await aki.back();
					continue;
				} else {
					ans = aki.answers.indexOf(choice);
				}
			}
		}
		const row = new ActionRowBuilder();
		row.addComponents(
			new ButtonBuilder().setLabel('Akinator Website').setStyle(ButtonStyle.Link).setURL('https://akinator.com/')
		);
		if (win === 'time' || aki.akiWin === null) {
			return buttonPress.editReply({ content: 'I guess your silence means I have won.', components: [row] });
		}
		if (aki.akiWin) {
			return buttonPress.editReply({
				content: 'Guessed right one more time! I love playing with you!',
				components: [row]
			});
		}
		return buttonPress.editReply({ content: 'Bravo, you have defeated me.', components: [row] });
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
