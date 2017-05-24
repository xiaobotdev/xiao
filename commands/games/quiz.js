const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class QuizCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            aliases: ['jeopardy'],
            group: 'games',
            memberName: 'quiz',
            description: 'Answer a quiz question.'
        });
    }

    async run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        try {
            const { body } = await snekfetch
                .get('https://opentdb.com/api.php')
                .query({
                    amount: 1,
                    type: 'boolean',
                    encode: 'url3986'
                });
            const answer = body.results[0].correct_answer.toLowerCase();
            const embed = new RichEmbed()
                .setTitle('You have **15** seconds to answer this question:')
                .setDescription(stripIndents`
                    **Category: ${decodeURIComponent(body.results[0].category)}**
                    **Difficulty: ${decodeURIComponent(body.results[0].difficulty)}**
                    True or False: ${decodeURIComponent(body.results[0].question)}
                `);
            msg.embed(embed);
            try {
                const collected = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (collected.first().content.toLowerCase() !== answer)
                    return msg.say(`Nope, sorry, it\'s ${answer}.`);
                return msg.say('Nice job! 10/10! You deserve some cake!');
            } catch (err) {
                return msg.say(`Time! It was ${answer}, sorry!`);
            }
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
