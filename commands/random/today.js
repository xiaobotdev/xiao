const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class TodayCommand extends commando.Command {
    constructor(Client) {
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
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        return request
            .get('http://history.muffinlabs.com/date')
            .set({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .buffer(true)
            .then(function(response) {
                let responseData = JSON.parse(response.text);
                let randomNumber = Math.floor(Math.random() * responseData.data.Events.length);
                const embed = new Discord.RichEmbed()
                    .setColor(0x9797FF)
                    .setURL(responseData.url)
                    .setTitle('On this day (' + responseData.date + ')...')
                    .setTimestamp()
                    .setDescription(responseData.data.Events[randomNumber].text + ' (' + responseData.data.Events[randomNumber].year + ')');
                return message.channel.sendEmbed(embed).catch(console.error);
            }).catch(function(err) {
                console.log(err);
                return message.channel.send(":x: Error! Something went wrong!");
            });
    }
};
