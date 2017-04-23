const { Command } = require('discord.js-commando');
const { lastNames, maleNames, femaleNames } = require('./names.json');

module.exports = class RandomNameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'name',
            aliases: [
                'namegen',
                'randomname'
            ],
            group: 'response',
            memberName: 'name',
            description: 'Generates a random name.',
            args: [{
                key: 'gender',
                prompt: 'Which gender do you want to generate a name for?',
                type: 'string',
                validate: gender => {
                    if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female') {
                        return true;
                    }
                    return 'Please enter either `male` or `female`.';
                },
                parse: text => {
                    return text.toLowerCase();
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { gender } = args;
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (gender === 'male') {
            const name = maleNames[Math.floor(Math.random() * maleNames.length)];
            return message.say(`${name} ${lastName}`);
        } else if (gender === 'female') {
            const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
            return message.say(`${name} ${lastName}`);
        }
    }
};
