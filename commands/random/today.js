const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class TodayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'today', 
            group: 'random',
            memberName: 'today',
            description: 'Tells you what happened today. (;today)',
            examples: [';today']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        const options = {
            method: 'GET',
            uri: 'http://history.muffinlabs.com/date',
            json: true
        }
        request(options).then(function (response) {
            let randomNumber = Math.floor(Math.random() * response.data.Events.length);
            const embed = new Discord.RichEmbed()
            .setColor(0x9797FF)
            .setURL(response.url)
            .setTitle('On this day (' + response.date + ')...')
            .setTimestamp()
            .setDescription(response.data.Events[randomNumber].text + ' (' + response.data.Events[randomNumber].year + ')');
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(function (err) {
            message.channel.send(":x: Error! Something went wrong!");
        });
    }
}

module.exports = TodayCommand;