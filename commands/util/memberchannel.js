const { Command } = require('discord.js-commando');

module.exports = class MemberLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberchannel',
            group: 'util',
            memberName: 'memberchannel',
            description: 'Sets the channel for the member logs to be sent.',
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
        message.guild.settings.set('memberLog', channel.name);
        return message.say(`Member Log channel set to ${channel.name}.`);
    }
};
