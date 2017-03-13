const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const config = require('../../config.json');

class BotSearchCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'botinfo', 
            group: 'search',
            memberName: 'botinfo',
            description: 'Searches Discord Bots for info on a bot. (;botinfo @Bot)',
            examples: [';botinfo @Bot']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        if(message.mentions.users.size === 1) {
            let botToFind = message.mentions.users.first().id;
            const options = {
                method: 'GET',
                uri: 'https://bots.discord.pw/api/bots/' + botToFind,
                headers: {
                    'Authorization': config.botskey
                },
                json: true
            }
            request(options).then(function (response) {
                const embed = new Discord.RichEmbed()
                .setColor(0x9797FF)
                .setAuthor('Discord Bots', 'https://cdn.discordapp.com/icons/110373943822540800/47336ad0631ac7aac0a48a2ba6246c65.jpg')
                .setTitle(response.name)
                .setURL('https://bots.discord.pw/')
                .setDescription(response.description)
                .addField('**Library:**', 
                    response.library, true)
                .addField('**Prefix:**',
                    response.prefix, true)
                .addField('**Invite:**',
                    '[Here](' + response.invite_url + ')', true);
                message.channel.sendEmbed(embed).catch(console.error);
            }).catch(function (err) {
                message.channel.sendMessage(":x: Error! Bot not Found!");
            });
        } else {
            message.channel.sendMessage(':x: Either too many or no bots, only mention one bot!');
        }
    }
}

module.exports = BotSearchCommand;