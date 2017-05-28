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
                    parse: type => type.toLowerCase(),
                    default: 'start'
                }
            ]
        });
    }

    hasPermission(msg) {
        const staffRole = msg.guild.roles.get(msg.guild.settings.get('staffRole'));
        if (staffRole && !msg.member.roles.has(staffRole.id)) return `You do not have the ${staffRole.name} role.`;
        else if (!msg.member.hasPermission('ADMINISTRATOR')) return 'You do not have the `Administrator` Permission.';
        else return true;
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('ADMINISTRATOR'))
            return msg.say('This Command requires the `Administrator` Permission.');
        const { type } = args;
        if (type === 'start') {
            try {
                await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: false });
                const staffRole = msg.guild.settings.get('staffRole');
                if (staffRole && !msg.channel.permissionOverwrites.has(staffRole))
                    await msg.channel.overwritePermissions(msg.guild.roles.get(staffRole), { SEND_MESSAGES: true });
                return msg.say(stripIndents`
                    Lockdown Started, users without Administrator ${staffRole ? 'or the Staff Role ' : ''}can no longer post messages.
                    Please use \`lockdown stop\` to end the lockdown.
                `);
            } catch (err) {
                return msg.say(`${err.name}: ${err.message}`);
            }
        } else if (type === 'stop') {
            try {
                await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: null });
                return msg.say('Lockdown Ended.');
            } catch (err) {
                return msg.say(`${err.name}: ${err.message}`);
            }
        }
    }
};
