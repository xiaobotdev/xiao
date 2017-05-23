const { Command } = require('discord.js-commando');

module.exports = class StarboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'starboard',
            group: 'settings',
            memberName: 'starboard',
            description: 'Sets the channel for the starboard.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'What is the channel you want to set as the starboard?',
                    type: 'channel'
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('ADMINISTRATOR');
    }

    run(msg, args) {
        const { channel } = args;
        msg.guild.settings.set('starboard', channel.id);
        return msg.say(`Starboard set to ${channel.name}.`);
    }
};
