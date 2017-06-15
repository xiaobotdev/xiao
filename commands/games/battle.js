const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class BattleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'battle',
            aliases: ['fight', 'death-battle'],
            group: 'games',
            memberName: 'battle',
            description: 'Choose another user and fight to the death!',
            guildOnly: true,
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
        if (opponent.bot) return msg.say('Bots cannot be fought.');
        if (opponent.id === msg.author.id) return msg.say('You may not fight yourself.');
        if (this.fighting.has(msg.guild.id)) return msg.say('Only one fight may be occurring per server.');
        this.fighting.add(msg.guild.id);
        await msg.say(`**${opponent.username}**, do you accept this challenge? **__Y__es** or **No**?`);
        const verify = await msg.channel.awaitMessages((res) => res.author.id === opponent.id, {
            max: 1,
            time: 30000
        });
        if (!verify.size || !['yes', 'y'].includes(verify.first().content.toLowerCase())) {
            this.fighting.delete(msg.guild.id);
            return msg.say('Looks like they declined...');
        }
        let userHP = 500;
        let oppoHP = 500;
        let userTurn = false;
        let guard = false;
        const reset = (changeGuard = true) => {
            if (userTurn) userTurn = false;
            else userTurn = true;
            if (changeGuard && guard) guard = false;
        };
        const dealDamage = (damage) => {
            if (userTurn) oppoHP -= damage;
            else userHP -= damage;
        };
        const forfeit = () => {
            if (userTurn) userHP = 0;
            else oppoHP = 0;
        };
        while (userHP > 0 && oppoHP > 0) { // eslint-disable-line no-unmodified-loop-condition
            const username = userTurn ? msg.author.username : opponent.username;
            const id = userTurn ? msg.author.id : opponent.id;
            await msg.say(stripIndents`
                **${username}**, do you **fight**, **guard**, **special**, or **run**?
                **${msg.author.username}**: ${userHP}HP
                **${opponent.username}**: ${oppoHP}HP
            `);
            const turn = await msg.channel.awaitMessages((res) => res.author.id === id, {
                max: 1,
                time: 30000
            });
            if (!turn.size) {
                await msg.say('Time!');
                forfeit();
                break;
            }
            const choice = turn.first().content.toLowerCase();
            if (choice === 'fight') {
                const damage = Math.floor(Math.random() * (guard ? 10 : 100)) + 1;
                await msg.say(`**${username}** deals **${damage}** damage!`);
                dealDamage(damage);
                reset();
            } else if (choice === 'guard') {
                await msg.say(`**${username}** guards!`);
                guard = true;
                reset(false);
            } else if (choice === 'special') {
                const hit = Math.floor(Math.random() * 4) + 1;
                if (hit === 1) {
                    const damage = Math.floor(Math.random() * ((guard ? 300 : 150) - 100 + 1) + 100);
                    await msg.say(`**${username}** deals **${damage}** damage!`);
                    dealDamage(damage);
                    reset();
                } else {
                    await msg.say(`**${username}**'s attack missed!`);
                    reset();
                }
            } else if (choice === 'run') {
                await msg.say(`**${username}** flees!`);
                forfeit();
                break;
            } else {
                await msg.say('I do not understand what you want to do.');
            }
        }
        this.fighting.delete(msg.guild.id);
        return msg.say(stripIndents`
            The match is over!
            **Winner:** ${userHP > oppoHP ? `${msg.author.username} (${userHP})` : `${opponent.username} (${oppoHP})`}
            **Loser:** ${userHP > oppoHP ? `${opponent.username} (${oppoHP})` : `${msg.author.username} (${userHP})`}
        `);
    }
};
