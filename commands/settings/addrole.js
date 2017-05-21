const { Command } = require('discord.js-commando');

module.exports = class AddRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-role',
            group: 'settings',
            memberName: 'add-role',
            description: 'Joins you to one of the open roles.',
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'Which role would you like to add?',
                    type: 'role'
                }
            ]
        });
    }

    run(msg, args) {
        const { role } = args;
        const roles = msg.guild.settings.get('openRoles');
        if (!roles) return msg.say('No Roles are open to join.');
        if (!roles.has(role.id)) return msg.say(`The ${role.name} role is not open.`);
        if (msg.member.roles.has(role.id)) return msg.say(`You already have the ${role.name} role.`);
        msg.member.addRole(role);
        return msg.say(`You have been given the ${role.name} role.`);
    }
};
