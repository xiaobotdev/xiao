const Command = require('../../structures/Command');

module.exports = class StarboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'starboard',
            group: 'settings',
            memberName: 'starboard',
            description: 'Sets the channel for the starboard.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to set as the starboard?',
                    type: 'channel'
                }
            ]
        });
    }

    run(msg, args) {
        const { channel } = args;
        msg.guild.settings.set('starboard', channel.id);
        return msg.say(`Starboard set to ${channel.name}.`);
    }
};
