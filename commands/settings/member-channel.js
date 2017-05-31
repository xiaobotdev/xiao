const Command = require('../../structures/Command');

module.exports = class MemberLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'member-channel',
            group: 'settings',
            memberName: 'member-channel',
            description: 'Sets the channel for the member logs to be sent.',
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
        msg.guild.settings.set('memberLog', channel.id);
        return msg.say(`Member Log channel set to ${channel.name}.`);
    }
};
