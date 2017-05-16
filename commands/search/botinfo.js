const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { DBOTS_KEY } = process.env;

module.exports = class BotSearchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bot-info',
            group: 'search',
            memberName: 'bot-info',
            description: 'Searches Discord Bots for info on a bot.',
            args: [
                {
                    key: 'bot',
                    prompt: 'Which bot do you want to get information for?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { bot } = args;
        try {
            const { body } = await snekfetch
                .get(`https://bots.discord.pw/api/bots/${bot.id}`)
                .set('Authorization', DBOTS_KEY);
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setAuthor('Discord Bots', 'https://i.imgur.com/lrKYBQi.jpg')
                .setTitle(body.name)
                .setURL(`https://bots.discord.pw/bots/${bot.id}`)
                .setDescription(body.description)
                .addField('Library',
                    body.library, true)
                .addField('Invite',
                    `[Here](${body.invite_url})`, true)
                .addField('Prefix',
                    body.prefix, true);
            return msg.embed(embed);
        } catch (err) {
            console.log(err);
            return msg.say(err);
        }
    }
};
