const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class ForecastCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'forecast',
            aliases: [
                'weatherforecast'
            ],
            group: 'search',
            memberName: 'forecast',
            description: 'Gets the seven-day forecast for a specified location. (;forecast San Francisco)',
            examples: [';forecast San Francisco'],
            args: [{
                key: 'locationQ',
                prompt: 'What location would you like to get the forecast for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const locationToSearch = args.locationQ;
        try {
            const response = await request
                .get('https://query.yahooapis.com/v1/public/yql')
                .query({
                    q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${locationToSearch}")`,
                    format: 'json'
                });
            const info = response.body.query.results.channel;
            const data = info.item.forecast;
            const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(info.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
                .setURL(info.link)
                .setTimestamp()
                .addField(`**${data[0].day} - ${data[0].date}:**`,
                    `**High:** ${data[0].high}°F, **Low:** ${data[0].low}°F, **Condition:** ${data[0].text}`)
                .addField(`**${data[1].day} - ${data[1].date}:**`,
                    `**High:** ${data[1].high}°F, **Low:** ${data[1].low}°F, **Condition:** ${data[1].text}`)
                .addField(`**${data[2].day} - ${data[2].date}:**`,
                    `**High:** ${data[2].high}°F, **Low:** ${data[2].low}°F, **Condition:** ${data[2].text}`)
                .addField(`**${data[3].day} - ${data[3].date}:**`,
                    `**High:** ${data[3].high}°F, **Low:** ${data[3].low}°F, **Condition:** ${data[3].text}`)
                .addField(`**${data[4].day} - ${data[4].date}:**`,
                    `**High:** ${data[4].high}°F, **Low:** ${data[4].low}°F, **Condition:** ${data[4].text}`)
                .addField(`**${data[5].day} - ${data[5].date}:**`,
                    `**High:** ${data[5].high}°F, **Low:** ${data[5].low}°F, **Condition:** ${data[5].text}`)
                .addField(`**${data[6].day} - ${data[6].date}:**`,
                    `**High:** ${data[6].high}°F, **Low:** ${data[6].low}°F, **Condition:** ${data[6].text}`);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Make sure you typed the location correctly!');
        }
    }
};
