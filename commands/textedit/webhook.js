const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { WEBHOOK_URL } = process.env;

module.exports = class WebhookCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'webhook',
            aliases: ['rin', 'rin-say'],
            group: 'textedit',
            memberName: 'webhook',
            description: 'Posts a message to the webhook defined in your `process.env`.',
            guildOnly: true,
            args: [
                {
                    key: 'content',
                    prompt: 'What text would you like the webhook to say?',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES'))
            return msg.say('This Command requires the `Manage Messages` Permission.');
        const { content } = args;
        try {
            msg.delete();
            await snekfetch
                .post(WEBHOOK_URL)
                .send({ content });
            return null;
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
