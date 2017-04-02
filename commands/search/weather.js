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
            let info = response.body.query.results.channel;
            const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor(info.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
                .setURL(info.link)
                .setTimestamp()
                .addField('**City:**',
                    info.location.city, true)
                .addField('**Country**',
                    info.location.country, true)
                .addField('**Region:**',
                    info.location.region, true)
                .addField('**Condition:**',
                    info.item.condition.text, true)
                .addField('**Temperature:**',
                    `${info.item.condition.temp}°F`, true)
                .addField('**Humidity:**',
                    info.atmosphere.humidity, true)
                .addField('**Pressure:**',
                    info.atmosphere.pressure, true)
                .addField('**Rising:**',
                    info.atmosphere.rising, true)
                .addField('**Visibility:**',
                    info.atmosphere.visibility, true)
                .addField('**Wind Chill:**',
                    info.wind.chill, true)
                .addField('**Wind Direction:**',
                    info.wind.direction, true)
                .addField('**Wind Speed:**',
                    info.wind.speed, true);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Make sure you typed the location correctly!");
        }
    }
};
