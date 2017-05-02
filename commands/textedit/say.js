const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: [
                'copy',
                'repeat',
                'echo'
            ],
            group: 'textedit',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish.',
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like XiaoBot to say?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES'))
            return msg.say('This Command requires the `Manage Messages` Permission.');
        const { text } = args;
        msg.delete();
        return msg.say(`\u180E${text}`);
    }
};
