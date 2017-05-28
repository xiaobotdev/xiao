const { Command } = require('discord.js-commando');

module.exports = class StaffRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'staff-role',
            group: 'settings',
            memberName: 'staff-role',
            description: 'Sets the role that can use Mod Commands without perms.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be staff?',
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
        msg.guild.settings.set('staffRole', role.id);
        return msg.say(`Server Staff role set to ${role.name}.`);
    }
};
