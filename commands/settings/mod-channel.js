const { Command } = require('discord.js-commando');

module.exports = class ModChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mod-channel',
            group: 'settings',
            memberName: 'mod-channel',
            description: 'Sets the channel for the mod logs to be sent.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to send logs to?',
                    type: 'channel'
                }
            ]
        });
    }

    hasPermission(msg) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return 'You do not have the `Administrator` Permission.';
        else return true;
    }

    run(msg, args) {
        const { channel } = args;
        msg.guild.settings.set('modLog', channel.id);
        return msg.say(`Mod Log channel set to ${channel.name}.`);
    }
};
