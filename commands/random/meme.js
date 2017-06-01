const Command = require('../../structures/Command');
const codes = require('../../assets/json/meme');

module.exports = class MemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            group: 'random',
            memberName: 'meme',
            description: 'Sends a Meme with text of your choice, and a background of your choice.',
            details: `**Codes:** ${codes.join(', ')}`,
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'type',
                    prompt: 'What meme type do you want to use?',
                    type: 'string',
                    validate: (type) => {
                        if (codes.includes(type.toLowerCase())) return true;
                        else return 'Invalid meme type. Use `help meme` to view a list of meme types.';
                    },
                    parse: (type) => type.toLowerCase()
                },
                {
                    key: 'top',
                    prompt: 'What should the top row of the meme to be?',
                    type: 'string',
                    parse: (top) => encodeURIComponent(top.replace(/[ ]/g, '-'))
                },
                {
                    key: 'bottom',
                    prompt: 'What should the bottom row of the meme to be?',
                    type: 'string',
                    parse: (bottom) => encodeURIComponent(bottom.replace(/[ ]/g, '-'))
                }
            ]
        });
    }

    run(msg, args) {
        const { type, top, bottom } = args;
        return msg.say({ files: [`https://memegen.link/${type}/${top}/${bottom}.jpg`] });
    }
};
