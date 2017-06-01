const Command = require('../../structures/Command');
const Cleverbot = require('cleverio');
const { CLEVS_KEY, CLEVS_USER, CLEVS_NICK } = process.env;

module.exports = class CleverbotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cleverbot',
            aliases: ['clevs', 'chat'],
            group: 'random',
            memberName: 'cleverbot',
            description: 'Talk to Cleverbot!',
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to say to Cleverbot?',
                    type: 'string'
                }
            ]
        });

        this.clevs = new Cleverbot.Client({
            key: CLEVS_KEY,
            user: CLEVS_USER,
            nick: CLEVS_NICK
        });
        this.clevs.create();
    }

    async run(msg, args) {
        const { text } = args;
        const { response } = await this.clevs.ask(text);
        return msg.reply(response);
    }
};
