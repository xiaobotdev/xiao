const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class YodaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yoda',
            group: 'textedit',
            memberName: 'yoda',
            description: 'Converts text to Yoda Speak. (;yoda This is Yoda.)',
            examples: [';yoda This is Yoda.'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to Yoda speak?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const text = encodeURIComponent(args.text);
        try {
            const response = await snekfetch
                .get(`https://yoda.p.mashape.com/yoda?sentence=${text}`)
                .set({
                    'X-Mashape-Key': process.env.MASHAPE_KEY,
                    'Accept': 'text/plain'
                });
            return message.say(`\u180E${response.text}`);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
