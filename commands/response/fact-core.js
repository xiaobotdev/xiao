const Command = require('../../structures/Command');
const facts = require('../../assets/json/fact-core');

module.exports = class FactCoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fact-core',
            group: 'response',
            memberName: 'fact-core',
            description: 'Says a random Fact Core quote.'
        });
    }

    run(msg) {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        return msg.say(fact);
    }
};
