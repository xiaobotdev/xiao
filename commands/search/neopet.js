const commando = require('discord.js-commando');

module.exports = class NeopetCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'neopet',
            group: 'search',
            memberName: 'neopet',
            description: "Gives a Neopet's image, searchable by ID. (;neopet rjwlsb8k)",
            examples: [';neopet rjwlsb8k', ';neopet getID'],
            args: [{
                key: 'pet',
                prompt: 'What pet ID would you like to get the image of?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let petID = args.pet;
        return message.say(`http://pets.neopets.com/cp/${petID}/1/5.png`);
    }
};
