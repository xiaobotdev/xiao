const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const words = require('../../assets/json/hangman');

module.exports = class HangmanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hangman',
            group: 'games',
            memberName: 'hangman',
            description: 'Play a game of hangman.'
        });
    }

    async run(msg) {
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
                for (const letter of word.split('')) {
                    if (letter !== choice) continue;
                    else display[word.indexOf(letter)] = choice;
                }
            } else {
                await msg.say('Nope!');
                points++;
            }
        }
        if (word.length === confirmation.length) return msg.say(`You won, it was ${word}!`);
        else return msg.say(`Too bad... It was ${word}...`);
    }
};
