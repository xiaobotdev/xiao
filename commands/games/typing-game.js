const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { sentences, difficulties, times } = require('../../assets/json/typing-game');

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
                    prompt: `What should the difficulty of the game be? One of: ${difficulties.join(', ')}`,
                    type: 'string',
                    validate: (difficulty) => {
                        if (difficulties.includes(difficulty.toLowerCase())) return true;
                        else return `The difficulty must be one of: ${difficulties.join(', ')}`;
                    },
                    parse: (difficulty) => difficulty.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { difficulty } = args;
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        const time = times[difficulty];
        const embed = new RichEmbed()
            .setTitle(`You have ${time / 1000} seconds to type:`)
            .setDescription(sentence);
        await msg.embed(embed);
        try {
            const collected = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
                max: 1,
                time: time,
                errors: ['time']
            });
            if (collected.first().content !== sentence) return msg.say('Nope, sorry!');
            else return msg.say('Nice job! 10/10! You deserve some cake!');
        } catch (err) {
            return msg.say('Time! Sorry!');
        }
    }
};
