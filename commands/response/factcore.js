const { Command } = require('discord.js-commando');
const facts = require('./facts.json');

module.exports = class FactCoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'factcore',
            group: 'response',
            memberName: 'factcore',
            description: 'Says a random Fact Core quote. (x;factcore)',
            examples: ['x;factcore']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const fact = facts[Math.floor(Math.random() * facts.length)];
        return message.say(fact);
    }
};
