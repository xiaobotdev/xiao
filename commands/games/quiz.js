const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class QuizCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        try {
            let response = await request
                .get('http://jservice.io/api/random')
                .query({
                    count: 1
                });
            let answer = response.body[0].answer.toLowerCase().split("<i>").join("").split("</i>").join("");
            const embed = new Discord.RichEmbed()
                .setTitle('You have **fifteen** seconds to answer this question:')
                .setDescription(`**Category: ${response.body[0].category.title}**\n${response.body[0].question}`);
            let embedMsg = await message.embed(embed);
            try {
                let collected = await message.channel.awaitMessages(res => res.content.toLowerCase() === answer && res.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                let victoryMsg = await message.say(`Good Job! You won! ${answer} is the correct answer!`);
                return [embedMsg, collected, victoryMsg];
            }
            catch (err) {
                let loseMsg = await message.say(`Aw... Too bad, try again next time!\nThe Correct Answer was: ${answer}`);
                return [embedMsg, loseMsg];
            }
        }
        catch (err) {
            return message.say(":x: Error! Something went wrong!");
        }
    }
};
