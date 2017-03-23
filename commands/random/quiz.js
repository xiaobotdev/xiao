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
        return request
            .get('http://jservice.io/api/random')
            .query({
                count: 1
            })
            .then(function(response) {
                const embed = new Discord.RichEmbed()
                    .setTitle('You have **fifteen** seconds to answer this question:')
                    .setDescription(`**Category: ${response.body[0].category}**\n${response.body[0].question}`);
                message.channel.sendEmbed(embed).then(() => {
                    message.channel.awaitMessages(res => res.content.toLowerCase() === response.body[0].answer.toLowerCase() && res.author.id === message.author.id, {
                        max: 1,
                        time: 15000,
                        errors: ['time'],
                    }).then((collected) => {
                        return message.channel.send(`Good Job! You won!`);
                    }).catch(() => {
                        return message.channel.send(`Aw... Too bad, try again next time!\nThe Correct Answer was: ${response.body[0].answer}`);
                    });
                }).catch(function(err) {
                    console.log(err);
                    return message.channel.send(":x: Error! Something went wrong!");
                });
            });
    }
};