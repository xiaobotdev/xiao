const Command = require('../../structures/Command');
const { lastNames, maleNames, femaleNames } = require('../../assets/json/name');

module.exports = class RandomNameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'name',
            group: 'response',
            memberName: 'name',
            description: 'Generates a random name.',
            args: [
                {
                    key: 'gender',
                    prompt: 'Which gender do you want to generate a name for?',
                    type: 'string',
                    validate: (gender) => {
                        if (['male', 'female'].includes(gender.toLowerCase())) return true;
                        else return 'Please enter either `male` or `female`.';
                    },
                    parse: (gender) => gender.toLowerCase()
                }
            ]
        });
    }

    run(msg, args) {
        const { gender } = args;
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (gender === 'male') {
            const name = maleNames[Math.floor(Math.random() * maleNames.length)];
            return msg.say(`${name} ${lastName}`);
        } else {
            const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
            return msg.say(`${name} ${lastName}`);
        }
    }
};
