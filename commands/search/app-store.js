const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class AppStoreCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'appstore',
            aliases: [
                'app-store',
                'app'
            ],
            group: 'search',
            memberName: 'appstore',
            description: 'Searches the App Store for your query. (;appstore DragonVale)',
            examples: [';appstore DragonVale'],
            args: [{
                key: 'query',
                prompt: 'What would you like to search the App Store for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let query = args.query;
        try {
            let response = await request
                .get('https://itunes.apple.com/search')
                .query({
                    term: query,
                    country: 'us',
                    entity: 'software',
                    limit: 1
                });
            let parsedResponse = JSON.parse(response.text);
            let data = parsedResponse.results[0];
            const embed = new Discord.RichEmbed()
                .setColor(0x1BA3F7)
                .setAuthor('App Store', 'https://upload.wikimedia.org/wikipedia/en/1/1f/App_Store_Logo.png')
                .setTitle(data.trackName)
                .setURL(data.trackViewUrl)
                .setDescription(data.description)
                .setThumbnail(data.artworkUrl512)
                .addField('**Version:**',
                    data.version, true)
                .addField('**Seller:**',
                    data.artistName, true)
                .addField('**Price:**',
                    `${data.formattedPrice} (USD)`, true)
                .addField('**Rated:**',
                    data.contentAdvisoryRating, true);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Something went wrong!");
        }
    }
};
