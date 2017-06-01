const Command = require('../../structures/Command');
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
            ownerOnly: true,
            clientPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'content',
                    prompt: 'What text would you like the webhook to say?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { content } = args;
        msg.delete();
        await snekfetch
            .post(WEBHOOK_URL)
            .send({ content });
        return null;
    }
};
