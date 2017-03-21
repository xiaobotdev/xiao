const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class TodayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'today',
            aliases: [
                'history'
            ],
            group: 'random',
            memberName: 'today',
            description: 'Tells you what happened today. (;today)',
            examples: [';today']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        request
        .get('http://history.muffinlabs.com/date')
        .then(function (response) {
            let randomNumber = Math.floor(Math.random() * response.body.data.Events.length);
            const embed = new Discord.RichEmbed()
            .setColor(0x9797FF)
            .setURL(response.body.url)
            .setTitle('On this day (' + response.body.date + ')...')
            .setTimestamp()
            .setDescription(response.body.data.Events[randomNumber].text + ' (' + response.body.data.Events[randomNumber].year + ')');
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(function (err) {
            message.channel.send(":x: Error! Something went wrong!");
        });
    }
};