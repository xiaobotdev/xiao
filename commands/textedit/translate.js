const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const codes = require('../../assets/json/translate');
const { YANDEX_KEY } = process.env;

module.exports = class TranslateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'translate',
            group: 'textedit',
            memberName: 'translate',
            description: 'Translates text to a specified language.',
            details: '**Codes:** https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#languages',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to translate?',
                    type: 'string'
                },
                {
                    key: 'to',
                    prompt: 'Which language is being translated to?',
                    type: 'string',
                    validate: (to) => {
                        if (codes[to.toLowerCase()]) return true;
                        else return 'Invalid Language Code. Use `help translate` for a list of codes.';
                    },
                    parse: (to) => to.toLowerCase()
                },
                {
                    key: 'from',
                    prompt: 'Which language is being translated from?',
                    type: 'string',
                    default: '',
                    validate: (from) => {
                        if (codes[from.toLowerCase()]) return true;
                        else return 'Invalid Language Code. Use `help translate` for a list of codes.';
                    },
                    parse: (from) => from.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { text, to, from } = args;
        const { body } = await snekfetch
            .get('https://translate.yandex.net/api/v1.5/tr.json/translate')
            .query({
                key: YANDEX_KEY,
                text,
                lang: from ? `${from}-${to}` : to
            });
        const lang = body.lang.split('-');
        const embed = new RichEmbed()
            .setColor(0x00AE86)
            .addField(`❯ From: ${codes[lang[0]]}`,
                text)
            .addField(`❯ To: ${codes[lang[1]]}`,
                body.text[0]);
        return msg.embed(embed);
    }
};
