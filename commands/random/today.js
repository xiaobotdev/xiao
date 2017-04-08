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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        try {
            const response = await request
                .get('http://history.muffinlabs.com/date')
                .set({
                    'Accept': 'application/json'
                })
                .buffer(true);
            const parsedResponse = JSON.parse(response.text);
            const events = parsedResponse.data.Events;
            const randomNumber = Math.floor(Math.random() * events.length);
            const embed = new Discord.RichEmbed()
                .setColor(0x9797FF)
                .setURL(parsedResponse.url)
                .setTitle(`On this day (${parsedResponse.date})...`)
                .setTimestamp()
                .setDescription(`${events[randomNumber].text} (${events[randomNumber].year})`);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
