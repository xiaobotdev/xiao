const { Command } = require('discord.js-commando');

module.exports = class RemoveRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-role',
            group: 'settings',
            memberName: 'remove-role',
            description: 'Removes you from one of the open roles.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'Which role would you like to remove?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, args) {
        const { role } = args;
        const roles = msg.guild.settings.get('openRoles');
        if (!roles) return msg.say('No Roles are open to join.');
        if (!roles.has(role.id)) return msg.say('This role is not open.');
        msg.member.removeRole(role);
        return msg.say(`You have been removed from the ${role.name} role.`);
    }
};
