const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const sentences = require('./sentences.json');

module.exports = class TypingGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'typinggame',
            group: 'games',
            memberName: 'typinggame',
            description: 'See how fast you can type a sentence in a given time limit.',
            args: [{
                key: 'difficulty',
                prompt: 'What difficulty should the typing game be? Easy, Medium, Hard, or Extreme?',
                type: 'string',
                validate: difficulty => {
                    if (difficulty.toLowerCase() === 'easy' || difficulty.toLowerCase() === 'medium' || difficulty.toLowerCase() === 'hard' || difficulty.toLowerCase() === 'extreme') {
                        return true;
                    }
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, or `extreme`.';
                },
                parse: text => text.toLowerCase()
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { difficulty } = args;
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        let time;
        let levelWord;
        switch (difficulty) {
            case 'easy':
                time = 25000;
                levelWord = 'twenty-five';
                break;
            case 'medium':
                time = 20000;
                levelWord = 'twenty';
                break;
            case 'hard':
                time = 15000;
                levelWord = 'fifteen';
                break;
            case 'extreme':
                time = 10000;
                levelWord = 'ten';
                break;
        }
        const embed = new RichEmbed()
            .setTitle(`You have **${levelWord}** seconds to type:`)
            .setDescription(sentence);
        await message.embed(embed);
        try {
            const collected = await message.channel.awaitMessages(response => response.author.id === message.author.id, {
                max: 1,
                time: time,
                errors: ['time']
            });
            if (collected.first().content !== sentence) {
                return message.say('Nope, your sentence does not match the original. Try again next time!');
            }
            return message.say(`Good Job! You won!`);
        } catch (err) {
            return message.say('Aw... Too bad, try again next time!');
        }
    }
};
