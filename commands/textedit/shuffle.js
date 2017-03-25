const commando = require('discord.js-commando');

String.prototype.shuffle = function() {
    let a = this.split(""),
        n = a.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};

module.exports = class ShuffleCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'shuffle',
            group: 'textedit',
            memberName: 'shuffle',
            description: 'Shuffles text (;shuffle This Text)',
            examples: [';shuffle This Text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to shuffle?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToShuffle = args.text;
        return message.say(thingToShuffle.shuffle());
    }
};
