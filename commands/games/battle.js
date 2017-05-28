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

        this.fighting = new Set();
    }

    async run(msg, args) {
        const { opponent } = args;
        if (opponent.bot) return msg.say('You cannot fight bots!');
        if (opponent.id === msg.author.id) return msg.say('You cannot fight yourself!');
        if (this.fighting.has(msg.guild.id)) return msg.say('There is already a fight in this server...');
        this.fighting.add(msg.guild.id);
        await msg.say(`**${opponent.username}**, do you accept this challenge? **__Y__es** or **No**?`);
        try {
            const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
                max: 1,
                time: 15000,
                errors: ['time']
            });
            if (['yes', 'y'].includes(verify.first().content.toLowerCase())) {
                let userHP = 500;
                let oppoHP = 500;
                let userTurn = true;
                let guard = false;
                let userCure = true;
                let oppoCure = true;
                while (userHP > 0 && oppoHP > 0) {
                    const username = userTurn ? msg.author.username : opponent.username;
                    await msg.say(stripIndents`
                        **${username}**, do you **fight**, **guard**, **special**, **cure**, or **run**?
                        **${msg.author.username}**: ${userHP}HP
                        **${opponent.username}**: ${oppoHP}HP
                    `);
                    try {
                        const turn = await msg.channel.awaitMessages(res => res.author.id === (userTurn ? msg.author.id : opponent.id), {
                            max: 1,
                            time: 15000,
                            errors: ['time']
                        });
                        const choice = turn.first().content.toLowerCase();
                        if (choice === 'fight') {
                            const damage = Math.floor(Math.random() * (guard ? 25 : 100)) + 1;
                            await msg.say(`**${username}** deals **${damage}** damage!`);
                            if (userTurn) {
                                oppoHP = oppoHP - damage;
                                userTurn = false;
                            } else {
                                userHP = userHP - damage;
                                userTurn = true;
                            }
                            if (guard) guard = false;
                        } else if (choice === 'guard') {
                            await msg.say(`**${username}** guards!`);
                            guard = true;
                            if (userTurn) userTurn = false;
                            else userTurn = true;
                        } else if (choice === 'special') {
                            const hit = Math.floor(Math.random() * 4) + 1;
                            if (hit === 1) {
                                const damage = Math.floor(Math.random() * ((guard ? 300 : 150) - 100 + 1) + 100);
                                await msg.say(`**${username}** deals **${damage}** damage!`);
                                if (userTurn) {
                                    oppoHP = oppoHP - damage;
                                    userTurn = false;
                                } else {
                                    userHP = userHP - damage;
                                    userTurn = true;
                                }
                                if (guard) guard = false;
                            } else {
                                await msg.say(`**${username}**'s attack missed!`);
                                if (guard) guard = false;
                                if (userTurn) userTurn = false;
                                else userTurn = true;
                            }
                        } else if (choice === 'cure') {
                            if (userTurn ? userCure : oppoCure) {
                                await msg.say(`**${username}** regains **250** health!`);
                                if (userTurn) {
                                    userHP = userHP + 250;
                                    userCure = false;
                                    userTurn = false;
                                } else {
                                    oppoHP = oppoHP + 250;
                                    oppoCure = false;
                                    userTurn = true;
                                }
                                if (guard) guard = false;
                            } else await msg.say('You have already cured!');
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
                this.fighting.delete(msg.guild.id);
                return msg.say(stripIndents`
                    The match is over!
                    **Winner: ${(userHP > oppoHP) ? `${msg.author.username}** (${userHP}HP)` : `${opponent.username}** (${oppoHP}HP)`}
                    **Loser: ${(userHP > oppoHP) ? `${opponent.username}** (${oppoHP}HP)` : `${msg.author.username}** (${userHP}HP)`}
                `);
            } else {
                this.fighting.delete(msg.guild.id);
                return msg.say('Guess that was a no then...');
            }
        } catch (err) {
            this.fighting.delete(msg.guild.id);
            return msg.say('Looks like they declined...');
        }
    }
};
