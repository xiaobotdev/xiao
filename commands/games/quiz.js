const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class QuizCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            aliases: [
                'jeopardy'
            ],
            group: 'games',
            memberName: 'quiz',
            description: 'Answer a quiz question. (;quiz)',
            examples: [';quiz']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        try {
            const response = await request
                .get('http://jservice.io/api/random')
                .query({
                    count: 1
                });
            const data = response.body[0];
            const answer = data.answer.toLowerCase().split('<i>').join('').split('</i>').join('');
            const embed = new Discord.RichEmbed()
                .setTitle('You have **fifteen** seconds to answer this question:')
                .setDescription(`**Category: ${data.category.title}**\n${data.question}`);
            const embedMsg = await message.embed(embed);
            try {
                const collected = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (collected.first().content.toLowerCase() !== answer) {
                    const loseMsg = await message.say(`The correct answer is: ${answer}`);
                    return [embedMsg, loseMsg];
                }
                const victoryMsg = await message.say(`The correct answer is: ${answer}`);
                return [embedMsg, victoryMsg];
            }
            catch (err) {
                const loseMsg = await message.say(`Aw... Too bad, try again next time!\nThe Correct Answer was: ${answer}`);
                return [embedMsg, loseMsg];
            }
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
