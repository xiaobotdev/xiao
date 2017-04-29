const { Command } = require('discord.js-commando');
const codes = require('./memecodes');

module.exports = class MemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            group: 'imageedit',
            memberName: 'meme',
            description: 'Sends a Meme with text of your choice, and a background of your choice.',
            details: `**Codes:** ${codes.join(', ')}`,
            args: [{
                key: 'type',
                prompt: 'What meme type do you want to use?',
                type: 'string',
                validate: type => {
                    if (codes.includes(type.toLowerCase()))
                        return true;
                    return `${type.toLowerCase()} is not a valid meme type. Use \`x;help meme\` to view a list of types.`;
                },
                parse: type => type.toLowerCase()
            }, {
                key: 'top',
                prompt: 'What should the top row of the meme to be?',
                type: 'string',
                validate: top => {
                    if (/[a-zA-Z0-9.,!?'\s]+$/g.test(top) && top.length < 100)
                        return true;
                    return `Please do not use special characters and keep the rows under 100 characters each, top row has ${top.length}.`;
                },
                parse: top => top.replace(/[ ]/g, '-').replace(/[?]/g, '~q')
            }, {
                key: 'bottom',
                prompt: 'What should the bottom row of the meme to be?',
                type: 'string',
                validate: bottom => {
                    if (/[a-zA-Z0-9.,!?'\s]+$/g.test(bottom) && bottom.length < 100)
                        return true;
                    return `Please do not use special characters and keep the rows under 100 characters each, bottom row has ${bottom.length}.`;
                },
                parse: bottom => bottom.replace(/[ ]/g, '-').replace(/[?]/g, '~q')
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const { type, top, bottom } = args;
        return message.channel.send({files: [`https://memegen.link/${type}/${top}/${bottom}.jpg`]})
            .catch(() => message.say('An Unknown Error Occurred.'));
    }
};
