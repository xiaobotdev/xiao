const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class CleverbotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cleverbot',
            aliases: [
                'clevs',
                'chat'
            ],
            group: 'random',
            memberName: 'cleverbot',
            description: 'Talk to Cleverbot.',
            args: [
                {
                    key: 'text',
                    prompt: 'What would you like to say to Cleverbot?',
                    type: 'string',
                    parse: text => encodeURIComponent(text)
                }
            ]
        });
    }

    async run(msg, args) {
        const { text } = args;
        try {
            const { body } = await request
                .post('https://cleverbot.io/1.0/ask')
                .send({ user: process.env.CLEVS_USER, key: process.env.CLEVS_KEY, text, nick: 'XiaoBot' });
            console.log(body.status, body.response, body);
            if(body.status !== 'success') throw new Error(body.status);
            return msg.reply(body.response);
        } catch(err) {
            return msg.say(`An Error Occurred: ${err}`);
        }
    }
};
