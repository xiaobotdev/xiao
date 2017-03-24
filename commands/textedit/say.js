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
            examples: [';say I can talk!']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let copycat = message.content.split(" ").slice(1).join(" ");
        if (!copycat) {
            message.channel.send(":x: Error! Nothing to say!");
        }
        else {
            if (message.channel.type === 'dm') {
                message.channel.send(copycat);
            }
            else {
                message.delete();
                message.channel.send(copycat);
            }
        }
    }
};
