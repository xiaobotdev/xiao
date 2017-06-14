const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const words = require('../../assets/json/hangman');

module.exports = class HangmanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hangman',
            group: 'games',
            memberName: 'hangman',
            description: 'Play a game of hangman.',
            guildOnly: true
        });

        this.playing = new Set();
    }

    async run(msg) {
        if (this.playing.has(msg.guild.id)) return msg.say('Only one game may be occurring per server.');
        this.playing.add(msg.guild.id);
        const word = words[Math.floor(Math.random() * words.length)];
        let points = 0;
        const confirmation = [];
        const display = '_'.repeat(word.length).split('');
        while (word.length !== confirmation.length && points < 7) {
            await msg.code(null, stripIndents`
                ___________
                |     |
                |     ${points > 0 ? 'O' : ''}
                |    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '—' : ''}
                |    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}
                ===========
                The word is: ${display.join(' ')}. Which letter do you choose?
            `);
            const guess = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
                max: 1,
                time: 30000
            });
            if (!guess.size) {
                await msg.say('Time!');
                break;
            }
            const choice = guess.first().content.toLowerCase();
            if (confirmation.includes(choice)) {
                await msg.say('You have already picked that letter!');
            } else if (word.includes(choice)) {
                await msg.say('Nice job!');
                confirmation.push(choice);
                let results = word.split('');
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === choice) {
                        results[i] = '';
                        display[i] = word[i];
                    }    
                }
            } else {
                await msg.say('Nope!');
                points++;
            }
        }
        this.playing.delete(msg.guild.id);
        if (word.length === confirmation.length) return msg.say(`You won, it was ${word}!`);
        else return msg.say(`Too bad... It was ${word}...`);
    }
};
