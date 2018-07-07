const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class DoomsdayClockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'doomsday-clock',
			group: 'events',
			memberName: 'doomsday-clock',
			description: 'Responds with the current time of the Doomsday Clock.'
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('https://thebulletin.org/doomsday-clock/past-announcements/');
			const time = text.match(/<h3 class="uabb-infobox-title">(.+)<\/h3>/)[1];
			const year = text.match(/<h5 class="uabb-infobox-title-prefix">(.+)<\/h5>/)[1];
			const description = text.match(/<div class="uabb-infobox-text uabb-text-editor"><p>(.+)<\/p>/)[1];
			const image = text.match(/<img class="uabb-photo-img wp-image-[0-9]+" src="(.+)" alt=/)[1];
			const embed = new MessageEmbed()
				.setTitle(`${year}: ${time}`)
				.setColor(0x000000)
				.setThumbnail(image)
				.setURL('https://thebulletin.org/doomsday-clock/current-time/')
				.setAuthor('Bulletin of the Atomic Scientists', undefined, 'https://thebulletin.org/')
				.setDescription(description.replace(/<a href="(.+)">(.+)<\/a>/, '[$2]($1)'));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
