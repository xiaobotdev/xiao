const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

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
			const { raw } = await snekfetch.get('https://thebulletin.org/timeline');
			const text = raw.toString();
			const time = text.match(/IT IS (.+) MINUTES TO MIDNIGHT/)[0];
			const desc = text.match(/<div class="body-text"><span class="timeline-year">(.+)<\/span>: (.+)<\/div>/);
			return msg.say(stripIndents`
				**${time}**
				${desc[1]}: ${desc[2].replace(/<a href="(?:.+)">(.+)<\/a>/g, '$1').replace(/<\/div>/g, '')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
