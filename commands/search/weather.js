const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'search',
            memberName: 'weather',
            description: 'Gets weather information for a specified location.',
            args: [{
                key: 'query',
                prompt: 'What location would you like to get the current weather for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u=\'f\' AND woeid in (select woeid from geo.places(1) where text="${query}")&format=json`);
            const embed = new RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(body.query.results.channel.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
                .setURL(body.query.results.channel.link)
                .setTimestamp()
                .addField('**City:**',
                    body.query.results.channel.location.city, true)
                .addField('**Country**',
                    body.query.results.channel.location.country, true)
                .addField('**Region:**',
                    body.query.results.channel.location.region, true)
                .addField('**Condition:**',
                    body.query.results.channel.item.condition.text, true)
                .addField('**Temperature:**',
                    `${body.query.results.channel.item.condition.temp}°F`, true)
                .addField('**Humidity:**',
                    body.query.results.channel.atmosphere.humidity, true)
                .addField('**Pressure:**',
                    body.query.results.channel.atmosphere.pressure, true)
                .addField('**Rising:**',
                    body.query.results.channel.atmosphere.rising, true)
                .addField('**Visibility:**',
                    body.query.results.channel.atmosphere.visibility, true)
                .addField('**Wind Chill:**',
                    body.query.results.channel.wind.chill, true)
                .addField('**Wind Direction:**',
                    body.query.results.channel.wind.direction, true)
                .addField('**Wind Speed:**',
                    body.query.results.channel.wind.speed, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The location may not have been found.');
        }
    }
};
