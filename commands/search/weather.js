const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class WeatherCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let locationToSearch = args.locationQ;
        try {
            let response = await request
                .get(`https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${locationToSearch}")&format=json`);
            const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(response.body.query.results.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
                .setURL(response.body.query.results.link)
                .setTimestamp()
                .addField('**City:**',
                    response.body.query.results.location.city, true)
                .addField('**Country**',
                    response.body.query.results.location.country, true)
                .addField('**Region:**',
                    response.body.query.results.location.region, true)
                .addField('**Condition:**',
                    response.body.query.results.item.condition.text, true)
                .addField('**Temperature:**',
                    `${response.body.query.results.item.condition.temp}°F`, true)
                .addField('**Humidity:**',
                    response.body.query.results.atmosphere.humidity, true)
                .addField('**Pressure:**',
                    response.body.query.results.atmosphere.pressure, true)
                .addField('**Rising:**',
                    response.body.query.results.atmosphere.rising, true)
                .addField('**Visibility:**',
                    response.body.query.results.atmosphere.visibility, true)
                .addField('**Wind Chill:**',
                    response.body.query.results.wind.chill, true)
                .addField('**Wind Direction:**',
                    response.body.query.results.wind.direction, true)
                .addField('**Wind Speed:**',
                    response.body.query.results.wind.speed, true);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Make sure you typed the location correctly!");
        }
    }
};
