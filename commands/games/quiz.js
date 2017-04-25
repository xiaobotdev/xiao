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
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
                return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        try {
            const { body } = await request
                .get('http://jservice.io/api/random?count=1');
            const data = body[0];
            const answer = data.answer.toLowerCase().replace(/(<i>|<\/i>)/g, '');
            const embed = new RichEmbed()
                .setTitle('You have **fifteen** seconds to answer this question:')
                .setDescription(`**Category: ${data.category.title}**\n${data.question}`);
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
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
