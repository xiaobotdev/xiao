const commando = require('discord.js-commando');
const moment = require('moment');
const sherlock = require('Sherlock');

module.exports = class RemindCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'remind',
            aliases: [
                'remindme'
            ],
            group: 'random',
            memberName: 'remind',
            description: 'Reminds you of something at a certain time. (;remind Eat Food tomorrow)',
            examples: [';remind Eat Food tomorrow'],
            args: [{
                key: 'remind',
                prompt: 'What should I remind you of?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let remindMe = args.remind;
        try {
            let remindTime = sherlock.parse(remindMe);
            let time = remindTime.startDate.getTime() - Date.now();
            let preRemind = await message.say(`I will remind you '${remindTime.eventTitle}' ${moment().add(time, 'ms').fromNow()}.`);
            const remindMessage = await new Promise(resolve => {
                setTimeout(() => resolve(message.say(`${message.author} you wanted me to remind you of: '${remindTime.eventTitle}'`)), time);
            });
            return [preRemind, remindMessage];
        }
        catch (err) {
            return message.say(":x: Error! Something went wrong! Perhaps you didn't enter a valid time with your data?");
        }
    }
};
