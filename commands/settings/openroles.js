const { Command } = require('discord.js-commando');

module.exports = class OpenRolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'open-roles',
            group: 'settings',
            memberName: 'open-roles',
            description: 'Lets you add or remove roles open for anyone to join.',
            guildOnly: true,
            args: [
                {
                    key: 'action',
                    prompt: 'Would you like to `add` or `remove` the role?',
                    type: 'string',
                    validate: action => {
                        if (['add', 'remove'].includes(action.toLowerCase())) return true;
                        return 'Please enter either `add` or `remove`.';
                    },
                    parse: action => action.toLowerCase()
                },
                {
                    key: 'role',
                    prompt: 'Which role would you like to add/remove?',
                    type: 'role'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { action, role } = args;
        const roles = msg.guild.settings.get('openRoles', new Set());
        if (action === 'add') {
            if (roles.size > 5) return msg.say('Only 5 roles may be open.');
            if (roles.has(role.id)) return msg.say(`${role.name} is already set to open.`);
            roles.add(role.id);
            msg.guild.settings.set('openRoles', roles);
            return msg.say(`${role.name} has been added to the open roles.`);
        } else if (action === 'remove') {
            if (!roles.has(role.id)) return msg.say(`${role.name} is not set to open.`);
            roles.delete(role.id);
            msg.guild.settings.set('openRoles', roles);
            return msg.say(`${role.name} has been remove from the open roles.`);
        }
    }
};
