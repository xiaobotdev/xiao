const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class ForecastCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'forecast',
            group: 'search',
            memberName: 'forecast',
            description: 'Gets the seven-day forecast for a specified location.',
            args: [
                {
                    key: 'query',
                    prompt: 'What location would you like to get the forecast for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await snekfetch
                .get('https://query.yahooapis.com/v1/public/yql')
                .query({
                    q: `select * from weather.forecast where u=\'f\' AND woeid in (select woeid from geo.places(1) where text="${query}")`,
                    format: 'json'
                });
            if (!body.query.count) throw new Error('Location Not Found.');
            const forecasts = body.query.results.channel.item.forecast;
            const embed = new RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(body.query.results.channel.title, 'https://i.imgur.com/2MT0ViC.png')
                .setURL(body.query.results.channel.link)
                .setTimestamp()
                .addField(`${forecasts[0].day} - ${forecasts[0].date}`,
                    `**High:** ${forecasts[0].high}°F, **Low:** ${forecasts[0].low}°F, **Condition:** ${forecasts[0].text}`)
                .addField(`${forecasts[1].day} - ${forecasts[1].date}`,
                    `**High:** ${forecasts[1].high}°F, **Low:** ${forecasts[1].low}°F, **Condition:** ${forecasts[1].text}`)
                .addField(`${forecasts[2].day} - ${forecasts[2].date}`,
                    `**High:** ${forecasts[2].high}°F, **Low:** ${forecasts[2].low}°F, **Condition:** ${forecasts[2].text}`)
                .addField(`${forecasts[3].day} - ${forecasts[3].date}`,
                    `**High:** ${forecasts[3].high}°F, **Low:** ${forecasts[3].low}°F, **Condition:** ${forecasts[3].text}`)
                .addField(`${forecasts[4].day} - ${forecasts[4].date}`,
                    `**High:** ${forecasts[4].high}°F, **Low:** ${forecasts[4].low}°F, **Condition:** ${forecasts[4].text}`)
                .addField(`${forecasts[5].day} - ${forecasts[5].date}`,
                    `**High:** ${forecasts[5].high}°F, **Low:** ${forecasts[5].low}°F, **Condition:** ${forecasts[5].text}`)
                .addField(`${forecasts[6].day} - ${forecasts[6].date}`,
                    `**High:** ${forecasts[6].high}°F, **Low:** ${forecasts[6].low}°F, **Condition:** ${forecasts[6].text}`);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
