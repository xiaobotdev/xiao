const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'moderation',
            memberName: 'lockdown',
            description: 'Locks down the current channel or removes a lockdown, which prevents non-administrator members from speaking.',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR'],
            allowStaff: true,
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

    async run(msg, args) {
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
