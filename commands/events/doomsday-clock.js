const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { decode: decodeHTML } = require('html-entities');
const { MessageEmbed } = require('discord.js');
const { embedURL } = require('../../util/Util');

module.exports = class DoomsdayClockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'doomsday-clock',
			group: 'events',
			memberName: 'doomsday-clock',
			description: 'Responds with the current time of the Doomsday Clock.',
			credit: [
				{
					name: 'Bulletin of the Atomic Scientists',
					url: 'https://thebulletin.org/',
					reason: 'Doomsday Clock Data',
					reasonURL: 'https://thebulletin.org/doomsday-clock/current-time/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('https://thebulletin.org/doomsday-clock/past-statements/');
			const time = text.match(/<h3 class="uabb-infobox-title">(.+)<\/h3>/)[1];
			const year = text.match(/<h5 class="uabb-infobox-title-prefix">(.+)<\/h5>/)[1];
			const description = text.match(/<div class="uabb-infobox-text uabb-text-editor">(.|\n)+<p>(.+)<\/p>/)[2]
				.replace(/<a href="(.+)" target="_blank" rel="noopener">(.+)<\/a>/, embedURL('$2', '$1'));
			const embed = new MessageEmbed()
				.setTitle(`${year}: ${time}`)
				.setColor(0x000000)
				.setURL('https://thebulletin.org/doomsday-clock/current-time/')
				.setAuthor('Bulletin of the Atomic Scientists', undefined, 'https://thebulletin.org/')
				.setDescription(decodeHTML(description));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
