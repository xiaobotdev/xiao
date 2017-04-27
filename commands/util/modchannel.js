const { Command } = require('discord.js-commando');

module.exports = class ModChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'modchannel',
            group: 'util',
            memberName: 'modchannel',
            description: 'Sets the channel for the mod logs to be sent.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'What is the channel you want to send logs to?',
                type: 'channel'
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('ADMINISTRATOR');
    }

    run(message, args) {
        const { channel } = args;
        return message.guild.settings.set('modLog', channel.name);
    }
};
