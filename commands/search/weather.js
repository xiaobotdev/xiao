const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'search',
            memberName: 'weather',
            description: 'Gets weather information for a specified location.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What location would you like to get the current weather for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get('https://query.yahooapis.com/v1/public/yql')
            .query({
                q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${query}")`, // eslint-disable-line max-len
                format: 'json'
            });
        if (!body.query.count) return msg.say('Location Not Found.');
        const embed = new RichEmbed()
            .setColor(0x0000FF)
            .setAuthor(body.query.results.channel.title, 'https://i.imgur.com/2MT0ViC.png')
            .setURL(body.query.results.channel.link)
            .setTimestamp()
            .addField('❯ City',
                body.query.results.channel.location.city, true)
            .addField('❯ Country',
                body.query.results.channel.location.country, true)
            .addField('❯ Region',
                body.query.results.channel.location.region, true)
            .addField('❯ Condition',
                body.query.results.channel.item.condition.text, true)
            .addField('❯ Temperature',
                `${body.query.results.channel.item.condition.temp}°F`, true)
            .addField('❯ Humidity',
                body.query.results.channel.atmosphere.humidity, true)
            .addField('❯ Pressure',
                body.query.results.channel.atmosphere.pressure, true)
            .addField('❯ Rising',
                body.query.results.channel.atmosphere.rising, true)
            .addField('❯ Visibility',
                body.query.results.channel.atmosphere.visibility, true)
            .addField('❯ Wind Chill',
                body.query.results.channel.wind.chill, true)
            .addField('❯ Wind Direction',
                body.query.results.channel.wind.direction, true)
            .addField('❯ Wind Speed',
                body.query.results.channel.wind.speed, true);
        return msg.embed(embed);
    }
};
