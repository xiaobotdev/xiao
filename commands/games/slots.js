const { Command } = require('discord.js-commando');

module.exports = class SlotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slots',
            group: 'games',
            memberName: 'slots',
            description: 'Play slots. (;slots)',
            examples: [';slots']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
        const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
        if (slotOne === slotTwo && slotOne === slotThree) {
            return message.say(`${slotOne}|${slotTwo}|${slotThree}\nWow! You won! Great job... er... luck!`);
        }
        return message.say(`${slotOne}|${slotTwo}|${slotThree}\nAww... You lost... Guess it's just bad luck, huh?`);
    }
};
