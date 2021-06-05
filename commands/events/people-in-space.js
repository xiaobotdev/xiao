const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class PeopleInSpaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'people-in-space',
			aliases: ['space', 'spacemen', 'astronauts', 'spacewomen'],
			group: 'events',
			memberName: 'people-in-space',
			description: 'Responds with the people currently in space.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Open Notify',
					url: 'http://open-notify.org/',
					reason: 'People in Space API',
					reasonURL: 'http://open-notify.org/Open-Notify-API/People-In-Space/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('http://api.open-notify.org/astros.json');
			const crafts = {};
			for (const person of body.people) {
				if (crafts[person.craft]) crafts[person.craft].push(person.name);
				else crafts[person.craft] = [person.name];
			}
			const embed = new MessageEmbed()
				.setColor(0x2E528E)
				.setImage('https://i.imgur.com/m3ooNfl.jpg');
			for (const [craft, people] of Object.entries(crafts)) {
				embed.addField(`❯ ${craft} (${people.length})`, people.join('\n'), true);
			}
			return msg.say(`There are currently **${body.number}** people in space!`, embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
