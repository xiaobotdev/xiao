const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class DiscrimCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'discrim',
            aliases: [
                'discriminator',
                'searchdiscrim'
            ],
            group: 'search',
            memberName: 'discrim',
            description: 'Searches for other users with a certain discriminator.',
            args: [{
                key: 'discrim',
                prompt: 'Which discriminator would you like to search for?',
                type: 'string',
                validate: discrim => {
                    if (/[0-9]+$/g.test(discrim) && discrim.length === 4)
                        return true;
                    return `${discrim} is not a valid discriminator.`;
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
                return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        const { discrim } = args;
        const users = await this.client.users.filter(u => u.discriminator === discrim).map(u => u.username).sort();
        const embed = new RichEmbed()
            .setTitle(`${users.length} Users with the discriminator: ${discrim}`)
            .setDescription(users.join(', '));
        return message.embed(embed);
    }
};
