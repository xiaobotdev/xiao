const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const request = require('superagent');

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
            const { body } = await request
                .get('http://jservice.io/api/random?count=1');
            const answer = body[0].answer.toLowerCase().replace(/(<i>|<\/i>)/g, '');
            const embed = new RichEmbed()
                .setTitle('You have **15** seconds to answer this question:')
                .setDescription(stripIndents`
                    **Category: ${body[0].category.title}**
                    ${body[0].question}
                `);
            msg.embed(embed);
            try {
                const collected = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (collected.first().content.toLowerCase() !== answer)
                    return msg.say(`The correct answer is: ${answer}.`);
                return msg.say(`Perfect! The correct answer is: ${answer}.`);
            } catch (err) {
                return msg.say(`Time! The correct answer is: ${answer}`);
            }
        } catch (err) {
            return msg.say(`An Error Occurred: ${err}.`);
        }
    }
};
