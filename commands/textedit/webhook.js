const commando = require('discord.js-commando');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class WebhookCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'webhook',
            aliases: [
                'rin',
                'rinsay'
            ],
            group: 'textedit',
            memberName: 'webhook',
            description: "Posts a message to the webhook defined in config. (;webhook Hey guys!)",
            examples: [";webhook Hey guys!"],
            guildOnly: true,
            args: [{
                key: 'text',
                prompt: 'What text would you like the webhook to say?',
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
        let content = args.text;
        try {
            let post = await request
                .post(config.webhook)
                .send({
                    content: content
                });
            let deleteMsg = await message.delete();
            return [post, deleteMsg];
        }
        catch (err) {
            return message.say(':x: Error! Message failed to send!');
        }
    }
};
