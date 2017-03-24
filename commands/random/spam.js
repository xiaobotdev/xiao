const commando = require('discord.js-commando');

module.exports = class SpamCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'spam',
            group: 'random',
            memberName: 'spam',
            description: 'Puts a picture of Spam. (;spam)',
            examples: [';spam']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        return message.channel.sendFile("./images/Spam.jpg");
    }
};
