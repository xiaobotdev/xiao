const commando = require('discord.js-commando');

module.exports = class RollChooseCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'roll',
            aliases: [
                'randomnumber',
                'dice'
            ],
            group: 'response',
            memberName: 'roll',
            description: 'Rolls a Dice of your choice. (;roll 6)',
            examples: [';roll 6']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let [value] = message.content.split(" ").slice(1);
        if (!value) {
            let roll = Math.floor(Math.random() * 6) + 1;
            message.channel.send(`You rolled a ${roll}`);
        }
        else if (value.match(/^[0-9]+$/)) {
            let roll = Math.floor(Math.random() * value) + 1;
            message.channel.send(`You rolled a ${roll}`);
        }
        else {
            message.channel.send(":x: Error! Your message either contains a number but the number is invalid, or the number is in the wrong place.\n:notepad_spiral: (Note: When using numbers such as 1,000, do not use a comma)");
        }
    }
};
