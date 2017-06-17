const Command = require('../../structures/Command');
const { lastNames, maleNames, femaleNames } = require('../../assets/json/name');

module.exports = class RandomNameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'name',
            group: 'random-res',
            memberName: 'name',
            description: 'Responds with a random name, with the gender of your choice.',
            args: [
                {
                    key: 'gender',
                    prompt: 'Which gender do you want to generate a name for?',
                    type: 'string',
                    default: 'both',
                    validate: (gender) => {
                        if (['male', 'female', 'both'].includes(gender.toLowerCase())) return true;
                        else return 'Please enter either `male`, `female`, or `both`.';
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
        } else if (gender === 'female') {
            const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
            return msg.say(`${name} ${lastName}`);
        } else if (gender === 'both') {
            const genders = ['male', 'female'];
            const randomGender = genders[Math.floor(Math.random() * genders.length)];
            if (randomGender === 'male') {
                const name = maleNames[Math.floor(Math.random() * maleNames.length)];
                return msg.say(`${name} ${lastName}`);
            } else if (randomGender === 'female') {
                const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
                return msg.say(`${name} ${lastName}`);
            }
        }
    }
};
