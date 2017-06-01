const Command = require('../../structures/Command');

module.exports = class TemperatureCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'temperature',
            group: 'numedit',
            memberName: 'temperature',
            description: 'Converts temperatures to/from Celsius, Fahrenheit, or Kelvin.',
            args: [
                {
                    key: 'base',
                    prompt: 'What temperature unit do you want to use as the base?',
                    type: 'string',
                    validate: (base) => {
                        if (['celsius', 'fahrenheit', 'kelvin'].includes(base.toLowerCase())) return true;
                        else return 'Please enter either `celsius`, `fahrenheit`, or `kelvin`.';
                    },
                    parse: (base) => base.toLowerCase()
                },
                {
                    key: 'to',
                    prompt: 'What temperature unit do you want to convert to?',
                    type: 'string',
                    validate: (to) => {
                        if (['celsius', 'fahrenheit', 'kelvin'].includes(to.toLowerCase())) return true;
                        else return 'Please enter either `celsius`, `fahrenheit`, or `kelvin`.';
                    },
                    parse: (to) => to.toLowerCase()
                },
                {
                    key: 'amount',
                    prompt: 'What temperature should be converted?',
                    type: 'integer'
                }
            ]
        });
    }

    run(msg, args) {
        const { base, to, amount } = args;
        if (base === to) return msg.say(`Converting ${base} to ${to} is the same value, dummy.`);
        if (base === 'celsius') {
            if (to === 'fahrenheit') return msg.say(`${amount}°C is ${(amount * 1.8) + 32}°F.`);
            else return msg.say(`${amount}°C is ${amount + 273.15}°K.`);
        } else if (base === 'fahrenheit') {
            if (to === 'celsius') return msg.say(`${amount}°F is ${(amount - 32) / 1.8}°C.`);
            else return msg.say(`${amount}°F is ${(amount + 459.67) * (5 / 9)}°K.`);
        } else {
            if (to === 'celsius') return msg.say(`${amount}°K is ${amount - 273.15}°C.`);
            else return msg.say(`${amount}°K is ${(amount * 1.8) - 459.67}°F.`);
        }
    }
};
