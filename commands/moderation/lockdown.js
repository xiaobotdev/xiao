const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Locks down the current channel or removes a lockdown, which prevents non-administrator members from speaking.',
            guildOnly: true,
            args: [
                {
                    key: 'type',
                    prompt: 'Please enter either `start` or `stop`.',
                    type: 'string',
                    validate: type => {
                        if (['start', 'stop'].includes(type.toLowerCase())) return true;
                        return 'Please enter either `start` or `stop`.';
                    },
                    parse: type => type.toLowerCase()
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('ADMINISTRATOR'))
            return msg.say('This Command requires the `Administrator` Permission.');
        const { type } = args;
        if (type === 'start') {
            try {
                await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: false });
                return msg.say(stripIndents`
                    Lockdown Started, users without Administrator can no longer post messages.
                    Please use \`lockdown stop\` to end the lockdown.
                `);
            } catch (err) {
                return msg.say(err);
            }
        } else if (type === 'stop') {
            try {
                await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: true });
                return msg.say('Lockdown Ended, users without Administrator can now post messages.');
            } catch (err) {
                return msg.say(err);
            }
        }
    }
};
