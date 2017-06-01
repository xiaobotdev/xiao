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
                    default: '',
                    validate: (discrim) => {
                        if (/[0-9]+$/g.test(discrim) && discrim.length === 4) return true;
                        else return 'Invalid Discriminator.';
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const discrim = args.discrim || msg.author.discriminator;
        const users = this.client.users.filter((user) => user.discriminator === discrim).map((user) => user.username);
        const embed = new RichEmbed()
            .setTitle(`${users.length} Users with the discriminator: ${discrim}`)
            .setDescription(users.join(', '));
        return msg.embed(embed);
    }
};
