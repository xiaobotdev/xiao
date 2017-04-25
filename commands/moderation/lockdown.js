const { Command } = require('discord.js-commando');

module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Locks down the current channel or removes a lockdown, which prevents non-roled members from speaking.',
            guildOnly: true,
            args: [{
                key: 'type',
                prompt: 'Please enter either start or stop.',
                type: 'string',
                validate: type => {
                    if (['start', 'stop'].includes(type.toLowerCase()))
                        return true;
                    return 'Please enter either `start` or `stop`.';
                },
                parse: text => text.toLowerCase()
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    async run(message, args) {
        if (!message.channel.permissionsFor(this.client.user).hasPermission('ADMINISTRATOR'))
            return message.say(':x: Error! I don\'t have the Administrator Permission!');
        const { type } = args;
        if (type === 'start') {
            try {
                await message.channel.overwritePermissions(message.guild.defaultRole, {
                    SEND_MESSAGES: false
                });
                return message.say('**Lockdown Started, users without Administrator can no longer post messages. Please use `;lockdown stop` to end the lockdown.**');
            } catch (err) {
                return message.say(':x: Error! Something went wrong!');
            }
        } else if (type === 'stop') {
            try {
                await message.channel.overwritePermissions(message.guild.defaultRole, {
                    SEND_MESSAGES: true
                });
                return message.say('**Lockdown Ended, users without Administrator can now post messages.**');
            } catch (err) {
                return message.say(':x: Error! Something went wrong!');
            }
        }
    }
};
