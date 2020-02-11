const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');

module.exports = class DiscriminatorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discriminator',
			aliases: ['discrim', 'search-discrim', 'search-discriminator'],
			group: 'info',
			memberName: 'discriminator',
			description: 'Searches for other users with a certain discriminator.',
			args: [
				{
					key: 'discrim',
					label: 'discriminator',
					prompt: 'Which discriminator would you like to search for?',
					type: 'string',
					default: msg => msg.author.discriminator,
					validate: discrim => {
						if (/^[0-9]+$/.test(discrim) && discrim.length === 4) return true;
						return 'Invalid discriminator.';
					}
				}
			]
		});
	}

	run(msg, { discrim }) {
		const users = this.client.users.cache
			.filter(user => user.discriminator === discrim)
			.map(user => user.username);
		return msg.say(stripIndents`
			**Found ${users.length} users with the discriminator #${discrim}:**
			${trimArray(users, 50).join(', ')}
		`);
	}
};
