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
            group: 'random',
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
            const embed = new Discord.RichEmbed()
                .setTitle('You have **fifteen** seconds to answer this question:')
                .setDescription(`**Category: ${response.body[0].category.title}**\n${response.body[0].question}`);
            let embedMsg = await message.channel.sendEmbed(embed);
            try {
                let collected = await message.channel.awaitMessages(res => res.content.toLowerCase() === response.body[0].answer.toLowerCase() && res.author.id === message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                message.channel.send(`Good Job! You won! ${response.body[0].answer} is the correct answer!`);
            }
            catch (err) {
                message.channel.send(`Aw... Too bad, try again next time!\nThe Correct Answer was: ${response.body[0].answer}`);
            }
        }
        catch (err) {
            message.channel.send(":x: Error! Something went wrong!");
        }
    }
};
