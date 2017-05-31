const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

module.exports = class DiscrimCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'discrim',
            aliases: ['discriminator', 'search-discrim'],
            group: 'search',
            memberName: 'discrim',
            description: 'Searches for other users with a certain discriminator.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'discrim',
                    prompt: 'Which discriminator would you like to search for?',
                    type: 'string',
                    validate: discrim => {
                        if (/[0-9]+$/g.test(discrim) && discrim.length === 4) return true;
                        return `${discrim} is not a valid discriminator.`;
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { discrim } = args;
        const users = this.client.users.filter(u => u.discriminator === discrim).map(u => u.username).sort();
        const embed = new RichEmbed()
            .setTitle(`${users.length} Users with the discriminator: ${discrim}`)
            .setDescription(users.join(', '));
        return msg.embed(embed);
    }
};
