const commando = require('discord.js-commando');

module.exports = class SlotsCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
        const slotFour = slotThing[Math.floor(Math.random() * slotThing.length)];
        if (slotOne === slotTwo && slotOne === slotThree && slotOne === slotFour) {
            return message.say(`${slotOne}|${slotTwo}|${slotThree}|${slotFour}\nWow! You won! Great job... er... luck!`);
        }
        else {
            return message.say(`${slotOne}|${slotTwo}|${slotThree}|${slotFour}\nAww... You lost... Guess it's just bad luck, huh?`);
        }
    }
};
