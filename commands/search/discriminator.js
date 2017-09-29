const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class DiscriminatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discriminator',
			aliases: ['discrim', 'search-discrim', 'search-discriminator'],
			group: 'search',
			memberName: 'discriminator',
			description: 'Searches for other users with a certain discriminator.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'discrim',
					prompt: 'Which discriminator would you like to search for?',
					type: 'string',
					default: '',
					validate: discrim => {
						if (/^[0-9]+$/g.test(discrim) && discrim.length === 4) return true;
						return 'Invalid discriminator.';
					}
				}
			]
		});
	}

	run(msg, { discrim }) {
		if (!discrim) discrim = msg.author.discriminator;
		const users = this.client.users.filter(user => user.discriminator === discrim).map(user => user.username);
		return msg.say(stripIndents`
			**Found ${users.length} users with the discriminator #${discrim}**
			${users.join(', ')}
		`);
	}
};
