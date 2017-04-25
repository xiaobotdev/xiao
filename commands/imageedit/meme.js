const { Command } = require('discord.js-commando');
const memecodes = require('./memecodes');

module.exports = class MemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            group: 'imageedit',
            memberName: 'meme',
            description: 'Sends a Meme with text of your choice, and a background of your choice.',
            details: `**Codes:** ${memecodes.join(', ')}`,
            args: [{
                key: 'type',
                prompt: 'What meme type do you want to use?',
                type: 'string',
                validate: type => {
                    if (memecodes.includes(type.toLowerCase()))
                        return true;
                    return `${type.toLowerCase()} is not a valid meme type. Use \`x;help meme\` to view a list of types.`;
                },
                parse: text => text.toLowerCase()
            }, {
                key: 'toprow',
                prompt: 'What should the top row of the meme to be?',
                type: 'string',
                validate: toprow => {
                    if (/[a-zA-Z0-9.,!?'\s]+$/g.test(toprow) && toprow.length < 100)
                        return true;
                    return `Please do not use special characters and keep the rows under 100 characters each, top row has ${toprow.length}.`;
                },
                parse: text => text.replace(/[ ]/g, '-').replace(/[?]/g, '~q')
            }, {
                key: 'bottomrow',
                prompt: 'What should the bottom row of the meme to be?',
                type: 'string',
                validate: bottomrow => {
                    if (/[a-zA-Z0-9.,!?'\s]+$/g.test(bottomrow) && bottomrow.length < 100)
                        return true;
                    return `Please do not use special characters and keep the rows under 100 characters each, bottom row has ${bottomrow.length}.`;
                },
                parse: text => text.replace(/[ ]/g, '-').replace(/[?]/g, '~q')
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES'))
                return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        const { type, toprow, bottomrow } = args;
        return message.channel.send({files: [`https://memegen.link/${type}/${toprow}/${bottomrow}.jpg`]})
            .catch(() => message.say(':x: Error! Something went wrong!'));
    }
};
