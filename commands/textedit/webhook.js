const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class WebhookCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'webhook',
            aliases: [
                'rin',
                'rinsay'
            ],
            group: 'textedit',
            memberName: 'webhook',
            description: 'Posts a message to the webhook defined in your `process.env`.',
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
        if (!message.channel.permissionsFor(this.client.user).permissions.has('MANAGE_MESSAGES'))
            return message.say('This Command requires the `Manage Messages` Permission.');
        const { text } = args;
        try {
            message.delete();
            await request
                .post(process.env.WEBHOOK_URL)
                .send({
                    content: text
                });
            return null;
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
