const { Command } = require('discord.js-commando');

module.exports = class JoinRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join-role',
            group: 'settings',
            memberName: 'join-role',
            description: 'Sets a role that new members are automatically joined to.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'What role should new members be joined to?',
                    type: 'role'
                }
            ]
        });
    }

    hasPermission(msg) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return 'You do not have the `Administrator` Permission.';
        else return true;
    }

    run(msg, args) {
        const { role } = args;
        msg.guild.settings.set('joinRole', role.id);
        return msg.say(`Join Role set to ${role.name}.`);
    }
};
