const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const script = require('../../assets/json/box-choosing');

module.exports = class BoxChoosingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'box-choosing',
			aliases: ['box-choose'],
			group: 'games-sp',
			memberName: 'box-choosing',
			description: 'Do you believe that there are choices in life? Taken from Higurashi Chapter 4.',
			game: true,
			credit: [
				{
					name: '07th Expansion',
					url: 'http://07th-expansion.net/',
					reason: 'Original Game'
				},
				{
					name: 'MangaGamer.com',
					url: 'https://www.mangagamer.com/',
					reason: 'Original Translation',
					reasonURL: 'https://store.steampowered.com/app/526490/Higurashi_When_They_Cry_Hou__Ch4_Himatsubushi/'
				}
			]
		});

		this.blue = new Set();
		this.red = new Set();
	}

	async run(msg) {
		let i = 0;
		let path = 'before';
		let end = false;
		let gameMsg = await msg.say('Loading...');
		while (!end) {
			const line = script[path][i];
			if (!line) {
				end = true;
				break;
			}
			if (line.options) {
				const choiceRows = new ActionRowBuilder();
				for (const option of line.options) {
					choiceRows.addComponents(
						new ButtonBuilder().setCustomId(option).setLabel(option).setStyle(ButtonStyle.Primary)
					);
				}
				choiceRows.addComponents(new ButtonBuilder().setCustomId('false').setLabel('End').setStyle(ButtonStyle.Danger));
				gameMsg = await gameMsg.edit({ content: line.text, components: [choiceRows] });
				let buttonPress;
				try {
					buttonPress = await gameMsg.awaitMessageComponent({
						filter: res => res.user.id === msg.author.id,
						max: 1,
						time: 30000
					});
					if (buttonPress.customId === 'false') {
						await buttonPress.deferUpdate();
						end = true;
						break;
					}
				} catch {
					await buttonPress.deferUpdate();
					end = true;
					break;
				}
				path = '';
				const pick = line.paths[line.options.indexOf(buttonPress.customId)];
				if ((this.red.has(msg.author.id) && pick !== 'red') || (this.blue.has(msg.author.id) && pick !== 'blue')) {
					path += 'both';
					if (this.red.has(msg.author.id)) this.red.delete(msg.author.id);
					if (this.blue.has(msg.author.id)) this.blue.delete(msg.author.id);
				} else {
					this[pick].add(msg.author.id);
				}
				path += pick;
				i = 0;
				await buttonPress.deferUpdate();
			} else {
				const proceedRows = new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId('true').setLabel('Yes').setStyle(ButtonStyle.Success),
					new ButtonBuilder().setCustomId('false').setLabel('No').setStyle(ButtonStyle.Danger)
				);
				gameMsg = await gameMsg.edit({ content: `${line}\n\n_Proceed?_`, components: [proceedRows] });
				let buttonPress;
				try {
					buttonPress = await gameMsg.awaitMessageComponent({
						filter: res => res.user.id === msg.author.id,
						max: 1,
						time: 30000
					});
					if (buttonPress.customId === 'false') {
						await buttonPress.deferUpdate();
						end = true;
						break;
					}
				} catch {
					await buttonPress.deferUpdate();
					end = true;
					break;
				}
				await buttonPress.deferUpdate();
				i++;
			}
		}
		return gameMsg.edit({ content: script.end, components: [] });
	}
};
