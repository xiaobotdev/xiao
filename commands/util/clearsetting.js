const { Command } = require('discord.js-commando');

module.exports = class ClearSettingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clearsetting',
            group: 'util',
            memberName: 'clearsetting',
            description: 'Removes a custom-set Mod Channel, Member Channel, or Staff Role.',
            guildOnly: true,
            args: [
                {
                    key: 'setting',
                    prompt: 'What setting do you want to clear? `modLog`, `memberLog`, `staffRole`, or `singleRole`?',
                    type: 'string',
                    validate: setting => {
                        if(['modLog', 'memberLog', 'staffRole', 'singleRole'].includes(setting))
                            return true;
                        return 'Please enter either `modLog`, `memberLog`, `staffRole`, or `singleRole`.';
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { setting } = args;
        msg.guild.settings.remove(setting);
        return msg.say(`${setting} has been removed from your guild settings.`);
    }
};
