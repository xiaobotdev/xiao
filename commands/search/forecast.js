const commando = require('discord.js-commando');
const Discord = require('discord.js');
const weather = require('yahoo-weather');

class ForecastCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'forecast', 
            group: 'search',
            memberName: 'forecast',
            description: 'Gets the seven-day forecast for a specified location. (;forecast San Francisco)',
            examples: [';forecast San Francisco']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let locationtosearch = message.content.split(" ").slice(1).join(" ");
        weather(locationtosearch, 'f').then(info => {
            const embed = new Discord.RichEmbed()
            .setColor(0x0000FF)
            .setAuthor(info.title, 'http://media.idownloadblog.com/wp-content/uploads/2013/12/yahoo-weather-213x220.png')
            .setURL(info.link)
            .setTimestamp()
            .addField('**' + info.item.forecast[0].day + " - " + info.item.forecast[0].date + ':**',
            '**High:** ' + info.item.forecast[0].high + ', **Low:** ' + info.item.forecast[0].low + ', **Condition:** ' + info.item.forecast[0].text)
            .addField('**' + info.item.forecast[1].day + " - " + info.item.forecast[1].date + ':**',
            '**High:** ' + info.item.forecast[1].high + ', **Low:** ' + info.item.forecast[1].low + ', **Condition:** ' + info.item.forecast[1].text)
            .addField('**' + info.item.forecast[2].day + " - " + info.item.forecast[2].date + ':**',
            '**High:** ' + info.item.forecast[2].high + ', **Low:** ' + info.item.forecast[2].low + ', **Condition:** ' + info.item.forecast[2].text)
            .addField('**' + info.item.forecast[3].day + " - " + info.item.forecast[3].date + ':**',
            '**High:** ' + info.item.forecast[3].high + ', **Low:** ' + info.item.forecast[3].low + ', **Condition:** ' + info.item.forecast[3].text)
            .addField('**' + info.item.forecast[4].day + " - " + info.item.forecast[4].date + ':**',
            '**High:** ' + info.item.forecast[4].high + ', **Low:** ' + info.item.forecast[4].low + ', **Condition:** ' + info.item.forecast[4].text)
            .addField('**' + info.item.forecast[5].day + " - " + info.item.forecast[5].date + ':**',
            '**High:** ' + info.item.forecast[5].high + ', **Low:** ' + info.item.forecast[5].low + ', **Condition:** ' + info.item.forecast[5].text)
            .addField('**' + info.item.forecast[6].day + " - " + info.item.forecast[6].date + ':**',
            '**High:** ' + info.item.forecast[6].high + ', **Low:** ' + info.item.forecast[6].low + ', **Condition:** ' + info.item.forecast[6].text);
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(err => {
            message.channel.sendMessage(":x: Error! Make sure you typed the location correctly!");
        });
    }
}

module.exports = ForecastCommand;