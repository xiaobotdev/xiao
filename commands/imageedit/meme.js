const { Command } = require('discord.js-commando');
const memecodes = ['tenguy', 'afraid', 'older', 'aag', 'tried', 'biw', 'blb', 'kermit', 'bd', 'ch', 'cbg', 'wonka', 'cb', 'keanu', 'dsm', 'live', 'ants', 'doge', 'alwaysonbeat', 'ermg', 'facepalm', 'fwp', 'fa', 'fbf', 'fry', 'hipster', 'icanhas', 'crazypills', 'mw', 'noidea', 'regret', 'boat', 'hagrid', 'sohappy', 'captain', 'inigo', 'iw', 'ackbar', 'happening', 'joker', 'ive', 'll', 'morpheus', 'mb', 'badchoice', 'mmm', 'jetpack', 'red', 'mordor', 'oprah', 'oag', 'remembers', 'philosoraptor', 'jw', 'patrick', 'rollsafe', 'sad-obama', 'sad-clinton', 'sadfrog', 'sad-bush', 'sad-biden', 'sad-boehner', 'saltbae', 'sarcasticbear', 'dwight', 'sb', 'ss', 'sf', 'dodgson', 'money', 'sohot', 'nice', 'awesome-awkward', 'awesome', 'awkward-awesome', 'awkward', 'fetch', 'success', 'scc', 'ski', 'officespace', 'interesting', 'toohigh', 'bs', 'center', 'both', 'winter', 'xy', 'buzz', 'yodawg', 'uno', 'yallgot', 'bad', 'elf', 'chosen'];

module.exports = class MemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: [
                'memegen'
            ],
            group: 'imageedit',
            memberName: 'meme',
            description: 'Sends a Meme with text of your choice, and a background of your choice. (;meme facepalm "I can\'t even" "comprehend this")',
            details: '**Codes:** tenguy, afraid, older, aag, tried, biw, blb, kermit, bd, ch, cbg, wonka, cb, keanu, dsm, live, ants, doge, alwaysonbeat, ermg, facepalm, fwp, fa, fbf, fry, hipster, icanhas, crazypills, mw, noidea, regret, boat, hagrid, sohappy, captain, inigo, iw, ackbar, happening, joker, ive, ll, morpheus, mb, badchoice, mmm, jetpack, red, mordor, oprah, oag, remembers, philosoraptor, jw, patrick, rollsafe, sad-obama, sad-clinton, sadfrog, sad-bush, sad-biden, sad-boehner, saltbae, sarcasticbear, dwight, sb, ss, sf, dodgson, money, sohot, nice, awesome-awkward, awesome, awkward-awesome, awkward, fetch, success, scc, ski, officespace, interesting, toohigh, bs, center, both, winter, xy, buzz, yodawg, uno, yallgot, bad, elf, chosen',
            examples: [';meme facepalm "I can\'t even" "comprehend this"'],
            args: [{
                key: 'type',
                prompt: 'What meme type do you want to use?',
                type: 'string',
                validate: type => {
                    if (memecodes.includes(type.toLowerCase())) {
                        return true;
                    }
                    return `${type.toLowerCase()} is not a valid meme type. Use \`x;help meme\` to view a list of types.`;
                },
                parse: text => {
                    return text.toLowerCase();
                }
            }, {
                key: 'toprow',
                prompt: 'What should the top row of the meme to be?',
                type: 'string',
                validate: toprow => {
                    if (toprow.match(/^[a-zA-Z0-9.,!?'\s]+$/) && toprow.length < 100) {
                        return true;
                    }
                    return `Please do not use special characters and keep the rows under 100 characters each, you have ${toprow.length}.`;
                },
                parse: text => {
                    return text.replace(/[ ]/g, '-').replace(/[?]/g, '~q');
                }
            }, {
                key: 'bottomrow',
                prompt: 'What should the bottom row of the meme to be?',
                type: 'string',
                validate: bottomrow => {
                    if (bottomrow.match(/^[a-zA-Z0-9.,!?'\s]+$/) && bottomrow.length < 100) {
                        return true;
                    }
                    return `Please do not use special characters and keep the rows under 100 characters each, you have ${bottomrow.length}.`;
                },
                parse: text => {
                    return text.replace(/[ ]/g, '-').replace(/[?]/g, '~q');
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const { type, toprow, bottomrow } = args;
        const link = `https://memegen.link/${type}/${toprow}/${bottomrow}.jpg`;
        return message.channel.send({file: link}).catch(() => message.say(':x: Error! Something went wrong!'));
    }
};
