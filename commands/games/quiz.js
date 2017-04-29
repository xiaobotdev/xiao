const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class QuizCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            aliases: [
                'jeopardy'
            ],
            group: 'games',
            memberName: 'quiz',
            description: 'Answer a quiz question.'
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        try {
            const { body } = await request
                .get('http://jservice.io/api/random?count=1');
            const answer = body[0].answer.toLowerCase().replace(/(<i>|<\/i>)/g, '');
            const embed = new RichEmbed()
                .setTitle('You have **15** seconds to answer this question:')
                .setDescription(`**Category: ${body[0].category.title}**\n${body[0].question}`);
            await message.embed(embed);
            try {
                const collected = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (collected.first().content.toLowerCase() !== answer)
                    return message.say(`The correct answer is: ${answer}`);
                return message.say(`Perfect! The correct answer is: ${answer}`);
            } catch (err) {
                return message.say(`Aw... Too bad, try again next time!\nThe Correct Answer was: ${answer}`);
            }
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
