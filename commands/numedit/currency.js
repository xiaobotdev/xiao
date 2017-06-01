const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const codes = require('../../assets/json/currency');

module.exports = class CurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'currency',
            group: 'numedit',
            memberName: 'currency',
            description: 'Converts from one currency to another.',
            details: `**Codes:** ${codes.join(', ')}`,
            args: [
                {
                    key: 'base',
                    prompt: 'What currency code do you want to use as the base?',
                    type: 'string',
                    validate: (base) => {
                        if (codes.includes(base.toUpperCase())) return true;
                        else return 'Invalid Currency Code. Use `help currency` to view a list of currency codes.';
                    },
                    parse: (base) => base.toUpperCase()
                },
                {
                    key: 'to',
                    prompt: 'What currency code do you want to convert to?',
                    type: 'string',
                    validate: (to) => {
                        if (codes.includes(to.toUpperCase())) return true;
                        else return 'Invalid Currency Code. Use `help currency` to view a list of currency codes.';
                    },
                    parse: (to) => to.toUpperCase()
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
        if (base === to) return msg.say(`Converting ${base} to ${to} is the same value, dummy.`);
        const { body } = await snekfetch
            .get('http://api.fixer.io/latest')
            .query({
                base,
                symbols: to
            });
        return msg.say(`${amount} ${base} is ${amount * body.rates[to]} ${to}.`);
    }
};
