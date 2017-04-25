const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class StrawpollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'strawpoll',
            group: 'random',
            memberName: 'strawpoll',
            description: 'Creates a Strawpoll with your options.',
            args: [{
                key: 'title',
                prompt: 'What would you like the title of the Strawpoll to be?',
                type: 'string',
                validate: title => {
                    if (title.length < 200)
                        return true;
                    return `Please keep your title under 200 characters, you have ${title.length}.`;
                }
            }, {
                key: 'choices',
                prompt: 'What choices do you want me pick from? Maximum of 31.',
                type: 'string',
                infinite: true,
                validate: choice => {
                    if (choice.length < 160)
                        return true;
                    return `Please keep your choices under 160 characters each, you have ${choice.length}.`;
                }
            }]
        });
    }

    async run(message, args) {
        const { title, choices } = args;
        if (choices.length < 2)
            return message.say(':x: Error! You provided less than two choices!');
        if (choices.length > 31)
            return message.say(':x: Error! You provided more than thirty choices!');
        try {
            const { body } = await request
                .post('https://strawpoll.me/api/v2/polls')
                .send({
                    title: title,
                    options: choices
                });
            return message.say(`${body.title}\nhttp://strawpoll.me/${body.id}`);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
