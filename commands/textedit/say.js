const commando = require('discord.js-commando');

module.exports = class SayCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'say',
            aliases: [
                'copy',
                'repeat',
                'parrot',
                'echo'
            ],
            group: 'textedit',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish. (;say I can talk!)',
            examples: [';say I can talk!'],
            guildOnly: true,
            args: [{
                key: 'text',
                prompt: 'What text would you like XiaoBot to say?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const copycat = args.text;
        await message.delete();
        return message.say(copycat);
    }
};
