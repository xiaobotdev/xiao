const commando = require('discord.js-commando');

module.exports = class LockdownCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Locks down the current server or removes a lockdown, which prevents non-roled members from speaking. (;lockdown start)',
            examples: [';lockdown start', ';lockdown stop'],
            guildOnly: true,
            args: [{
                key: 'type',
                prompt: 'Please enter either start or stop.',
                type: 'string',
                validate: type => {
                    if (type.toLowerCase() === 'start' || type.toLowerCase() === 'stop') {
                        return true;
                    }
                    return 'Please enter either start or stop.';
                }
            }]
        });
    }
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['READ_MESSAGES', 'SEND_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ADMINISTRATOR')) return message.say(':x: Error! I don\'t have the Administrator permission! This is not given by default, as that\'s quite bad practice. Please give it to me to use the lockdown command!');
        }
        console.log(`[Command] ${message.content}`);
        const type = args.type;
        if (type.toLowerCase() === 'start') {
            try {
                await message.channel.overwritePermissions(message.guild.defaultRole, {
                    SEND_MESSAGES: false
                });
                return message.say('**Lockdown Started, users without Administrator can no longer post messages. Please use ;lockdown stop to end the lockdown.**');
            }
            catch (err) {
                return message.say(':x: Error! Something went wrong!');
            }
        }
        if (type.toLowerCase() === 'stop') {
            try {
                await message.channel.overwritePermissions(message.guild.defaultRole, {
                    SEND_MESSAGES: true
                });
                return message.say('**Lockdown Ended, users without Administrator can now post messages.**');
            }
            catch (err) {
                return message.say(':x: Error! Something went wrong!');
            }
        }
    }
};
