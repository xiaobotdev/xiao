const { Command } = require('discord.js-commando');
const slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];

module.exports = class SlotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slots',
            group: 'games',
            memberName: 'slots',
            description: 'Play slots.'
        });
    }

    run(message) {
        const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
        if (slotOne === slotTwo && slotOne === slotThree)
            return message.say(`${slotOne}|${slotTwo}|${slotThree}\nWow! You won! Great job... er... luck!`);
        return message.say(`${slotOne}|${slotTwo}|${slotThree}\nAww... You lost... Guess it's just bad luck, huh?`);
    }
};
