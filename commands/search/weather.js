const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class WeatherCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'search',
            memberName: 'weather',
            description: 'Searches weather for a specified location. (;weather San Francisco)',
            examples: [';weather San Francisco'],
            args: [{
                key: 'locationQ',
                prompt: 'What location would you like to get the current weather for?',
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
            const data = response.body.query.results.channel;
            const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(data.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
                .setURL(data.link)
                .setTimestamp()
                .addField('**City:**',
                    data.location.city, true)
                .addField('**Country**',
                    data.location.country, true)
                .addField('**Region:**',
                    data.location.region, true)
                .addField('**Condition:**',
                    data.item.condition.text, true)
                .addField('**Temperature:**',
                    `${data.item.condition.temp}°F`, true)
                .addField('**Humidity:**',
                    data.atmosphere.humidity, true)
                .addField('**Pressure:**',
                    data.atmosphere.pressure, true)
                .addField('**Rising:**',
                    data.atmosphere.rising, true)
                .addField('**Visibility:**',
                    data.atmosphere.visibility, true)
                .addField('**Wind Chill:**',
                    data.wind.chill, true)
                .addField('**Wind Direction:**',
                    data.wind.direction, true)
                .addField('**Wind Speed:**',
                    data.wind.speed, true);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Make sure you typed the location correctly!');
        }
    }
};
