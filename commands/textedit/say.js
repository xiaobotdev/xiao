const Command = require('../../structures/Command');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['copy', 'echo'],
            group: 'textedit',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish.',
            guildOnly: true,
            clientPermissions: ['MANAGE_MESSAGES'],
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
        const { text } = args;
        msg.delete();
        return msg.say(`\u180E${text}`);
    }
};
