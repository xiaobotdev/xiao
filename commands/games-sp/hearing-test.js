const Command = require('../../framework/Command');
const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { stripIndents } = require('common-tags');
const { delay } = require('../../util/Util');
const data = require('../../assets/json/hearing-test');

module.exports = class HearingTestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hearing-test',
			aliases: ['hear-test', 'hear', 'hearing'],
			group: 'games-sp',
			memberName: 'hearing-test',
			description: 'Test your hearing.',
			throttling: {
				usages: 2,
				duration: 10
			},
			guildOnly: true,
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			credit: [
				{
					name: 'Noise addicts',
					url: 'http://www.noiseaddicts.com/',
					reason: 'Sounds',
					reasonURL: 'http://www.noiseaddicts.com/2011/06/mosquito-ringtones/'
				}
			]
		});
	}

	async run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		let age;
		let range;
		let previousAge = 'all';
		let previousRange = 8;
		const gameMsg = await msg.say('Here\'s the first sound. Listen carefully!');
		let buttonPress;
		for (const { age: dataAge, khz, file } of data) {
			connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'hearing-test', file));
			await delay(8000);
			const rows = new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId('true').setLabel('Yes').setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId('false').setLabel('No').setStyle(ButtonStyle.Danger)
			);
			await gameMsg.edit({ content: 'Did you hear that sound?', components: [rows] });
			try {
				buttonPress = await gameMsg.awaitMessageComponent({
					filter: res => res.user.id === msg.author.id,
					max: 1,
					time: 30000
				});
				if (buttonPress.customId === 'false') {
					age = previousAge;
					range = previousRange;
					break;
				}
			} catch {
				age = previousAge;
				range = previousRange;
				break;
			}
			if (buttonPress.customId !== 'true' && file === data[data.length - 1].file) {
				age = previousAge;
				range = previousRange;
				break;
			}
			previousAge = dataAge;
			previousRange = khz;
			await buttonPress.update({
				content: 'Great! Here\'s the next one, listen carefully!',
				components: []
			});
		}
		if (age === 'all') {
			return gameMsg.edit({
				content: 'Everyone should be able to hear that. You cannot hear.',
				components: []
			});
		}
		if (age === 'max') {
			return gameMsg.edit({
				content: stripIndents`
					You can hear any frequency of which a human is capable.
					The maximum frequency you were able to hear was **${range}000hz**.
				`,
				components: []
			});
		}
		return gameMsg.edit({
			content: stripIndents`
				You have the hearing of someone **${Number.parseInt(age, 10) + 1} or older**.
				The maximum frequency you were able to hear was **${range}000hz**.
			`,
			components: []
		});
	}
};
