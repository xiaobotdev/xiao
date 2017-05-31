const Command = require('../../structures/Command');

module.exports = class StaffRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'staff-role',
            group: 'settings',
            memberName: 'staff-role',
            description: 'Sets the role that can use Mod Commands without perms.',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'role',
                    prompt: 'What role should be staff?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, args) {
        const { role } = args;
        msg.guild.settings.set('staffRole', role.id);
        return msg.say(`Server Staff role set to ${role.name}.`);
    }
};
