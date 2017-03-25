const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class RinSayCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'rin',
            aliases: [
                'rinsay'
            ],
            group: 'textedit',
            memberName: 'rin',
            description: "Posts a message to the Rin webhook in Heroes of Dreamland. (;rin Hey guys!)",
            examples: [";rin Hey guys!"],
            guildOnly: true,
            args: [{
                key: 'text',
                prompt: 'What text would you like Rin to say?',
                type: 'string'
            }]
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'MANAGE_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let rinContent = args.text;
        try {
            let post = await request
                .post(config.webhook)
                .send({
                    content: rinContent
                });
            let deleteMsg = await message.delete();
            return [post, deleteMsg];
        }
        catch (err) {
            return message.say(':x: Error! Message failed to send!');
        }
    }
};
