const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class DefineCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'define',
            aliases: [
                'definition',
                'defineword',
                'dictionary',
                'wordnik'
            ],
            group: 'search',
            memberName: 'define',
            description: 'Defines a word. (;define Cat)',
            examples: [';define Cat'],
            args: [{
                key: 'word',
                prompt: 'What would you like to define?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const defineThis = encodeURI(args.word);
        try {
            const response = await request
                .get(`http://api.wordnik.com:80/v4/word.json/${defineThis}/definitions`)
                .query({
                    limit: 1,
                    includeRelated: false,
                    useCanonical: false,
                    includeTags: false,
                    api_key: process.env.WORDNIK_KEY
                });
            const data = response.body[0];
            const embed = new Discord.RichEmbed()
                .setColor(0x9797FF)
                .setTitle(data.word)
                .setDescription(data.text);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Word not Found!');
        }
    }
};
