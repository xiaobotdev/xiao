const commando = require('discord.js-commando');
const memecodes = ['tenguy', 'afraid', 'older', 'aag', 'tried', 'biw', 'blb', 'kermit', 'bd', 'ch', 'cbg', 'wonka', 'cb', 'keanu', 'dsm', 'live', 'ants', 'doge', 'alwaysonbeat', 'ermg', 'facepalm', 'fwp', 'fa', 'fbf', 'fry', 'hipster', 'icanhas', 'crazypills', 'mw', 'noidea', 'regret', 'boat', 'hagrid', 'sohappy', 'captain', 'inigo', 'iw', 'ackbar', 'happening', 'joker', 'ive', 'll', 'morpheus', 'mb', 'badchoice', 'mmm', 'jetpack', 'red', 'mordor', 'oprah', 'oag', 'remembers', 'philosoraptor', 'jw', 'patrick', 'rollsafe', 'sad-obama', 'sad-clinton', 'sadfrog', 'sad-bush', 'sad-biden', 'sad-boehner', 'saltbae', 'sarcasticbear', 'dwight', 'sb', 'ss', 'sf', 'dodgson', 'money', 'sohot', 'nice', 'awesome-awkward', 'awesome', 'awkward-awesome', 'awkward', 'fetch', 'success', 'scc', 'ski', 'officespace', 'interesting', 'toohigh', 'bs', 'center', 'both', 'winter', 'xy', 'buzz', 'yodawg', 'uno', 'yallgot', 'bad', 'elf', 'chosen'];

module.exports = class MemeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: [
                'memegen'
            ],
            group: 'imageedit',
            memberName: 'meme',
            description: 'Sends a Meme with text of your choice, and a background of your choice. Split first and second lines with a | (;meme facepalm I can\'t even | comprehend this)',
            details: '**Codes:** tenguy, afraid, older, aag, tried, biw, blb, kermit, bd, ch, cbg, wonka, cb, keanu, dsm, live, ants, doge, alwaysonbeat, ermg, facepalm, fwp, fa, fbf, fry, hipster, icanhas, crazypills, mw, noidea, regret, boat, hagrid, sohappy, captain, inigo, iw, ackbar, happening, joker, ive, ll, morpheus, mb, badchoice, mmm, jetpack, red, mordor, oprah, oag, remembers, philosoraptor, jw, patrick, rollsafe, sad-obama, sad-clinton, sadfrog, sad-bush, sad-biden, sad-boehner, saltbae, sarcasticbear, dwight, sb, ss, sf, dodgson, money, sohot, nice, awesome-awkward, awesome, awkward-awesome, awkward, fetch, success, scc, ski, officespace, interesting, toohigh, bs, center, both, winter, xy, buzz, yodawg, uno, yallgot, bad, elf, chosen',
            examples: [';meme facepalm I can\'t even | comprehend this'],
            args: [{
                key: 'type',
                prompt: 'What meme type do you want to use?',
                type: 'string',
                validate: type => {
                    if (memecodes.some(memeArray => type.toLowerCase() === memeArray)) {
                        return true;
                    }
                    return 'Please enter a valid meme type. Use `;help meme` to view a list of types.';
                }
            }, {
                key: 'content',
                prompt: 'What should the meme content be? Split the bottom and top text of the meme with " | ".',
                type: 'string',
                validate: content => {
                    if (content.includes(' | ') && content.match(/^[a-zA-Z0-9|.,!?'-\s]+$/)) {
                        return true;
                    }
                    return 'Please split your choices with ' | ' and do not use special characters.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const type = args.type.toLowerCase();
        const content = args.content;
        const memeQuery = content.split(' ').join('-').split('-|-');
        const toprow = memeQuery[0].split('?').join('~q');
        const bottomrow = memeQuery[1].split('?').join('~q');
        const link = `https://memegen.link/${type}/${toprow}/${bottomrow}.jpg`;
        if (bottomrow.length > 100) return message.say(':x: Error! Bottom text is over 100 characters!');
        if (toprow.length > 100) return message.say(':x: Error! Top text is over 100 characters!');
        return message.channel.sendFile(link).catch(err => message.say(':x: Error! Something went wrong!'));
    }
};
