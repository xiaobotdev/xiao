const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
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

    run(msg) {
        const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
        const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
        if(slotOne === slotTwo && slotOne === slotThree)
            return msg.say(stripIndents`
                ${slotOne}|${slotTwo}|${slotThree}
                Wow! You won! Great job... er... luck!
            `);
        return msg.say(stripIndents`
            ${slotOne}|${slotTwo}|${slotThree}
            Aww... You lost... Guess it's just bad luck, huh?
        `);
    }
};
