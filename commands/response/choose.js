const commando = require('discord.js-commando');

module.exports = class ChooseCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'choose',
            aliases: [
                'pick'
            ],
            group: 'response',
            memberName: 'choose',
            description: 'Chooses between things. (;choose Cow | Sheep)',
            examples: [';choose Cow | Sheep', ';choose Bark | Woof | Meow | Moo']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.content.includes(" | ")) {
            let choices = message.content.split(" ").slice(1).join(" ").split(' | ');
            choices = choices[Math.floor(Math.random() * choices.length)];
            return message.channel.send(`I choose ${choices}!`);
        }
        else {
            return message.channel.send(":x: Split your two choices with a ' | '!");
        }
    }
};
