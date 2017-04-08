const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const languages = {
    "af": "Afrikaans",
    "am": "Amharic",
    "ar": "Arabic",
    "az": "Azerbaijani",
    "ba": "Bashkir",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "eo": "Esperanto",
    "es": "Spanish",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "ga": "Irish",
    "gd": "Scots Gaelic",
    "gl": "Galician",
    "gu": "Gujarati",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "ht": "Haitian",
    "hu": "Hungarian",
    "hy": "Armenian",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "ja": "Japanese",
    "jv": "Javanese",
    "ka": "Georgian",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "ky": "Kyrgyz",
    "la": "Latin",
    "lb": "Luxembourgish",
    "lo": "Loa",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mg": "Malagasy",
    "mhr": "Mari",
    "mi": "Maori",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mn": "Mongolian",
    "mr": "Marathi",
    "mrj": "Hill Mari",
    "ms": "Malay",
    "mt": "Maltese",
    "my": "Burmese",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "pa": "Punjabi",
    "pap": "Papiamento",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "si": "Sinhalese",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sq": "Albanian",
    "sr": "Serbian",
    "su": "Sundanese",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "tg": "Tajik",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "tt": "Tatar",
    "udm": "Udmurt",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "zh": "Chinese"
};

module.exports = class TranslateCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'translate',
            group: 'textedit',
            memberName: 'translate',
            description: 'Translates text to a given language. (;translate ja Give me the money!)',
            details: '**Codes:** af: Afrikaans, am: Amharic, ar: Arabic, az: Azerbaijani, ba: Bashkir, be: Belarusian, bg: Bulgarian, bn: Bengali, bs: Bosnian, ca: Catalan, ceb: Cebuano, cs: Czech, cy: Welsh, da: Danish, de: German, el: Greek, en: English, eo: Esperanto, es: Spanish, et: Estonian, eu: Basque, fa: Persian, fi: Finnish, fr: French, ga: Irish, gd: Scots Gaelic, gl: Galician, gu: Gujarati, he: Hebrew, hi: Hindi, hr: Croatian, ht: Haitian, hu: Hungarian, hy: Armenian, id: Indonesian, is: Icelandic, it: Italian, ja: Japanese, jv: Javanese, ka: Georgian, kk: Kazakh, km: Khmer, kn: Kannada, ko: Korean, ky: Kyrgyz, la: Latin, lb: Luxembourgish, lo: Loa, lt: Lithuanian, lv: Latvian, mg: Malagasy, mhr: Mari, mi: Maori, mk: Macedonian, ml: Malayalam, mn: Mongolian, mr: Marathi, mrj: Hill Mari, ms: Malay, mt: Maltese, my: Burmese, ne: Nepali, nl: Dutch, no: Norwegian, pa: Punjabi, pap: Papiamento, pl: Polish, pt: Portuguese, ro: Romanian, ru: Russian, si: Sinhalese, sk: Slovak, sl: Slovenian, sq: Albanian, sr: Serbian, su: Sundanese, sv: Swedish, sw: Swahili, ta: Tamil, te: Telugu, tg: Tajik, th: Thai, tl: Tagalog, tr: Turkish, tt: Tatar, udm: Udmurt, uk: Ukrainian, ur: Urdu, uz: Uzbek, vi: Vietnamese, xh: Xhosa, yi: Yiddish, zh: Chinese',
            examples: [';translate ja Give me the the money!'],
            args: [{
                key: 'to',
                prompt: 'What language would you like to translate to?',
                type: 'string',
                validate: to => {
                    if (languages[to.toLowerCase()]) {
                        return true;
                    }
                    return 'Please enter a valid language code. Use `;help translate` for a list of codes.';
                }
            }, {
                key: 'text',
                prompt: 'What text would you like to translate?',
                type: 'string',
                validate: content => {
                    if (content.length > 200) {
                        return 'Please keep translation queries under 200 characters.';
                    }
                    return true;
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        console.log(`[Command] ${message.content}`);
        const languageto = args.to.toLowerCase();
        const query = args.text;
        try {
            const response = await request
                .get(`https://translate.yandex.net/api/v1.5/tr.json/translate`)
                .query({
                    key: process.env.YANDEX_KEY,
                    lang: languageto,
                    text: query
                });
            const data = response.body;
            const translated = data.text[0];
            const languages = data.lang.split('-');
            const langTo = languages[1];
            const langFrom = languages[0];
            const embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .addField(`Input (From: ${languages[langFrom]}):`,
                    query)
                .addField(`Translation (To: ${languages[langTo]}):`,
                    translated);
            return message.embed(embed);
        }
        catch (err) {
            console.error(err);
            return message.say(':x: Error! Something went wrong!');
        }
    }
};