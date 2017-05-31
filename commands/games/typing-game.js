const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const sentences = require('../../assets/json/typing-game');

module.exports = class TypingGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'typing-game',
            group: 'games',
            memberName: 'typing-game',
            description: 'See how fast you can type a sentence in a given time limit.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'difficulty',
                    prompt: 'What should the difficulty of the game be? `Easy`, `Medium`, `Hard`, `Extreme`, or `Impossible`?',
                    type: 'string',
                    validate: difficulty => {
                        if (['easy', 'medium', 'hard', 'extreme', 'impossible'].includes(difficulty.toLowerCase())) return true;
                        return 'The difficulty must be either `easy`, `medium`, `hard`, `extreme`, or `impossible`.';
                    },
                    parse: difficulty => difficulty.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { difficulty } = args;
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        let time;
        switch(difficulty) {
            case 'easy':
                time = 25000;
                break;
            case 'medium':
                time = 20000;
                break;
            case 'hard':
                time = 15000;
                break;
            case 'extreme':
                time = 10000;
                break;
            case 'impossible':
                time = 5000;
                break;
        }
        const embed = new RichEmbed()
            .setTitle(`You have **${time / 1000}** seconds to type:`)
            .setDescription(sentence);
        await msg.embed(embed);
        try {
            const collected = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
                max: 1,
                time: time,
                errors: ['time']
            });
            if (collected.first().content !== sentence) return msg.say('Nope, sorry!');
            return msg.say(`Good Job! You won!`);
        } catch (err) {
            return msg.say('Time! Sorry!');
        }
    }
};
