const commando = require('discord.js-commando');
const request = require('superagent');

module.exports = class YodaCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
        const turnToYoda = args.text;
        try {
            const response = await request
                .get('https://yoda.p.mashape.com/yoda')
                .set({
                    'X-Mashape-Key': process.env.MASHAPE_KEY,
                    'Accept': 'text/plain'
                })
                .query({
                    sentence: turnToYoda
                });
            return message.say(`\u180E${response.text}`);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
