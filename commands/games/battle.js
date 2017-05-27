const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class BattleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'battle',
            aliases: ['fight', 'death-battle'],
            group: 'games',
            memberName: 'battle',
            description: 'Choose another user and fight to the death!',
            args: [
                {
                    key: 'opponent',
                    prompt: 'Who would you like to battle?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        const { opponent } = args;
        if (opponent.bot) return msg.say('You cannot fight bots!');
        await msg.say(`${opponent.username}, do you accept this challenge? Yes or No?`);
        try {
            const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
                max: 1,
                time: 15000,
                errors: ['time']
            });
            if (verify.first().content.toLowerCase() === 'yes') {
                let userHP = 500;
                let oppoHP = 500;
                let userTurn = true;
                let guard = false;
                while (userHP > 0 && oppoHP > 0) {
                    const username = userTurn ? msg.author.username : opponent.username;
                    await msg.say(`${username}, do you fight, guard, special, or run?`);
                    try {
                        const turn = await msg.channel.awaitMessages(res => res.author.id === (userTurn ? msg.author.id : opponent.id), {
                            max: 1,
                            time: 15000,
                            errors: ['time']
                        });
                        const choice = turn.first().content.toLowerCase();
                        if (choice === 'fight') {
                            const damage = Math.floor(Math.random() * (guard ? 50 : 100)) + 1;
                            await msg.say(`${username} deals ${damage} damage!`);
                            if (userTurn) oppoHP = oppoHP - damage;
                            else userHP = userHP - damage;
                            if (guard) guard = false;
                            if (userTurn) userTurn = false;
                            else userTurn = true;
                        } else if (choice === 'guard') {
                            await msg.say(`${username} guards!`);
                            guard = true;
                            if (userTurn) userTurn = false;
                            else userTurn = true;
                        } else if (choice === 'special') {
                            const hit = Math.floor(Math.random() * 2) + 1;
                            if (hit === 1) {
                                const damage = Math.floor(Math.random() * (guard ? 150 : 300)) + 1;
                                await msg.say(`${username} deals ${damage} damage!`);
                                if (userTurn) oppoHP = oppoHP - damage;
                                else userHP = userHP - damage;
                                if (guard) guard = false;
                                if (userTurn) userTurn = false;
                                else userTurn = true;
                            } else {
                                await msg.say('It missed!');
                                if (guard) guard = false;
                                if (userTurn) userTurn = false;
                                else userTurn = true;
                            }
                        } else if (choice === 'run') {
                            await msg.say(`${username} flees!`);
                            if (userTurn) userHP = 0;
                            else oppoHP = 0;
                        } else await msg.say('I do not understand what you want to do.');
                    } catch (err) {
                        await msg.say('Time!');
                        break;
                    }
                }
                return msg.say(stripIndents`
                    The match is over!
                    Winner: ${(userHP > oppoHP) ? `${msg.author.username} (${userHP})` : `${opponent.username} (${oppoHP})`}!
                    Loser: ${(userHP > oppoHP) ? `${opponent.username} (${oppoHP})` : `${msg.author.username} (${userHP})`}...
                `);
            } else return msg.say('Guess that was a no then...');
        } catch (err) {
            return msg.say('Looks like they declined...');
        }
    }
};
