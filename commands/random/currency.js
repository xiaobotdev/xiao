const { Command } = require('discord.js-commando');
const request = require('superagent');
const codes = require('./currencycodes');

module.exports = class CurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'currency',
            group: 'random',
            memberName: 'currency',
            description: 'Converts from one currency to another.',
            details: `**Codes:** ${codes.join(', ')}`,
            args: [
                {
                    key: 'base',
                    prompt: 'What currency code do you want to use as the base?',
                    type: 'string',
                    validate: base => {
                        if(codes.includes(base.toUpperCase()))
                            return true;
                        return `${base} is not a valid currency code. Use \`help currency\` to view a list of codes.`;
                    },
                    parse: base => base.toUpperCase()
                },
                {
                    key: 'to',
                    prompt: 'What currency code do you want to convert to?',
                    type: 'string',
                    validate: to => {
                        if(codes.includes(to.toUpperCase()))
                            return true;
                        return `${to} is not a valid currency code. Use \`help currency\` to view a list of codes.`;
                    },
                    parse: code => code.toUpperCase()
                },
                {
                    key: 'amount',
                    prompt: 'How much money should be converted? Do not use symbols.',
                    type: 'integer'
                }
            ]
        });
    }

    async run(msg, args) {
        const { base, to, amount } = args;
        if(base === to) return msg.say(`${amount} ${base} is ${amount} ${base}.`);
        try {
            const { body } = await request
                .get(`http://api.fixer.io/latest?base=${base}&symbols=${to}`);
            const rate = body.rates[to];
            const converted = rate * amount;
            return msg.say(`${amount} ${base} is ${converted} ${to}.`);
        } catch(err) {
            return msg.say('An Unknown Error Occurred.');
        }
    }
};
