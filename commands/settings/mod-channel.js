const Command = require('../../structures/Command');

module.exports = class ModChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mod-channel',
            group: 'settings',
            memberName: 'mod-channel',
            description: 'Sets the channel for the mod logs to be sent.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to send logs to?',
                    type: 'channel'
                }
            ]
        });
    }

    run(msg, args) {
        const { channel } = args;
        msg.guild.settings.set('modLog', channel.id);
        return msg.say(`Mod Log channel set to ${channel.name}.`);
    }
};
