const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class WikipediaCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'wikipedia',
            group: 'search',
            memberName: 'wikipedia',
            description: 'Searches Wikipedia for something. (;wikipedia Cat)',
            examples: [';wikipedia Cat'],
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToSearch = encodeURI(args.query);
        thingToSearch = thingToSearch.split(")").join("%29");
        try {
            let response = await request
                .get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${thingToSearch}&exintro=&explaintext=&redirects=&formatversion=2`);
            let description = response.body.query.pages[0].extract;
            let name = response.body.query.pages[0].title;
            if (!description) return message.say(":x: Error! Entry Not Found!");
            description = description.substr(0, 1900);
            description = description.split('\n').join("\n\n");
            const embed = new Discord.RichEmbed()
                .setColor(0xE7E7E7)
                .setTitle(name)
                .setURL(`https://en.wikipedia.org/wiki/${thingToSearch}`)
                .setAuthor("Wikipedia", "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png")
                .setDescription(`${description} [Read the Rest Here](https://en.wikipedia.org/wiki/${thingToSearch})`);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Entry Not Found!");
        }
    }
};
