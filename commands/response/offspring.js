const Command = require('../../structures/Command');
const genders = ['boy', 'girl'];

module.exports = class OffspringCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'offspring',
            group: 'response',
            memberName: 'offspring',
            description: 'Tells you if your new child is a boy or a girl.'
        });
    }

    run(msg) {
        const gender = genders[Math.floor(Math.random() * genders.length)];
        return msg.say(`It's a ${gender}!`);
    }
};
