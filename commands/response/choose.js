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
            examples: [';choose Cow | Sheep', ';choose Bark | Woof | Meow | Moo'],
            args: [{
                key: 'choices',
                prompt: 'What choices do you want me pick from? Split them with " | "!',
                type: 'string',
                validate: content => {
                    if (content.includes(' | ')) {
                        return true;
                    }
                    return 'Please split your choices with ` | `.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let choices = args.choices;
        if (!choices.includes(' | ')) return message.channel.send(':x: Error! Split your messages with a " | "!');
        choices = choices.split(" | ");
        choices = choices[Math.floor(Math.random() * choices.length)];
        return message.channel.send(`I choose ${choices}!`);
    }
};
