const { Command } = require('discord.js-commando');
const facts = require('./facts');

module.exports = class FactCoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'factcore',
            group: 'response',
            memberName: 'factcore',
            description: 'Says a random Fact Core quote.'
        });
    }

    run(msg) {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        return msg.say(fact);
    }
};
