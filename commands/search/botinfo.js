const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class BotSearchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            group: 'search',
            memberName: 'botinfo',
            description: 'Searches Discord Bots for info on a bot.',
            args: [{
                key: 'bot',
                prompt: 'Which bot do you want to get information for?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).permissions.has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        let { bot } = args;
        bot = bot.id;
        try {
            const { body } = await request
                .get(`https://bots.discord.pw/api/bots/${bot}`)
                .set({
                    'Authorization': process.env.DISCORD_BOTS_KEY
                });
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setAuthor('Discord Bots', 'https://cdn.discordapp.com/icons/110373943822540800/47336ad0631ac7aac0a48a2ba6246c65.jpg')
                .setTitle(body.name)
                .setURL('https://bots.discord.pw/')
                .setDescription(body.description)
                .addField('**Library:**',
                    body.library, true)
                .addField('**Invite:**',
                    `[Here](${body.invite_url})`, true)
                .addField('**Prefix:**',
                    body.prefix, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The bot may not have been found.');
        }
    }
};
