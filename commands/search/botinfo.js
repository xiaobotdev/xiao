const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class BotSearchCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'botinfo',
            aliases: [
                'bot',
                'botdata'
            ],
            group: 'search',
            memberName: 'botinfo',
            description: 'Searches Discord Bots for info on a bot. (;botinfo @Bot)',
            examples: [';botinfo @Bot'],
            args: [{
                key: 'bot',
                prompt: 'Which bot do you want to get information for?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let botToFind = args.bot.id;
        try {
            let response = await request
                .get(`https://bots.discord.pw/api/bots/${botToFind}`)
                .set({
                    'Authorization': config.botskey
                });
            const embed = new Discord.RichEmbed()
                .setColor(0x9797FF)
                .setAuthor('Discord Bots', 'https://cdn.discordapp.com/icons/110373943822540800/47336ad0631ac7aac0a48a2ba6246c65.jpg')
                .setTitle(response.body.name)
                .setURL('https://bots.discord.pw/')
                .setDescription(response.body.description)
                .addField('**Library:**',
                    response.body.library, true)
                .addField('**Prefix:**',
                    response.body.prefix, true)
                .addField('**Invite:**',
                    `[Here](${response.body.invite_url})`, true);
            return message.channel.sendEmbed(embed);
        }
        catch (err) {
            return message.channel.send(":x: Error! Bot not Found!");
        }
    }
};
