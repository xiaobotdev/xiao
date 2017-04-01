const commando = require('discord.js-commando');
const Discord = require('discord.js');
const translate = require('google-translate-api');
const languages = {
    "auto": "Automatic",
    "af": "Afrikaans",
    "sq": "Albanian",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh-cn": "Chinese Simplified",
    "zh-tw": "Chinese Traditional",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ma": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sudanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};

module.exports = class TranslateCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'translate',
            group: 'textedit',
            memberName: 'translate',
            description: 'Translates text to a given language. (;translate ja Give me the money!)',
            details: "**Codes:** af: Afrikaans, sq: Albanian, ar: Arabic, hy: Armenian, az: Azerbaijani, eu: Basque, be: Belarusian, bn: Bengali, bs: Bosnian, bg: Bulgarian, ca: Catalan, ceb: Cebuano, ny: Chichewa, zh-cn: Chinese Simplified, zh-tw: Chinese Traditional, co: Corsican, hr: Croatian, cs: Czech, da: Danish, nl: Dutch, en: English, eo: Esperanto, et: Estonian, tl: Filipino, fi: Finnish, fr: French, fy: Frisian, gl: Galician, ka: Georgian, de: German, el: Greek, gu: Gujarati, ht: Haitian Creole, ha: Hausa, haw: Hawaiian, iw: Hebrew, hi: Hindi, hmn: Hmong, hu: Hungarian, is: Icelandic, ig: Igbo, id: Indonesian, ga: Irish, it: Italian, ja: Japanese, jw: Javanese, kn: Kannada, kk: Kazakh, km: Khmer, ko: Korean, ku: Kurdish (Kurmanji), ky: Kyrgyz, lo: Lao, la: Latin, lv: Latvian, lt: Lithuanian, lb: Luxembourgish, mk: Macedonian, mg: Malagasy, ms: Malay, ml: Malayalam, mt: Maltese, mi: Maori, mr: Marathi, mn: Mongolian, my: Myanmar (Burmese), ne: Nepali, no: Norwegian, ps: Pashto, fa: Persian, pl: Polish, pt: Portuguese, ma: Punjabi, ro: Romanian, ru: Russian, sm: Samoan, gd: Scots Gaelic, sr: Serbian, st: Sesotho, sn: Shona, sd: Sindhi, si: Sinhala, sk: Slovak, sl: Slovenian, so: Somali, es: Spanish, su: Sudanese, sw: Swahili, sv: Swedish, tg: Tajik, ta: Tamil, te: Telugu, th: Thai, tr: Turkish, uk: Ukrainian, ur: Urdu, uz: Uzbek, vi: Vietnamese, cy: Welsh, xh: Xhosa, yi: Yiddish, yo: Yoruba, zu: Zulu",
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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let languageto = args.to.toLowerCase();
        let thingToTranslate = args.text;
        try {
            let res = await translate(thingToTranslate, {
                to: languageto
            });
            let languagefrom = res.from.language.iso.toLowerCase();
            const embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .addField(`Input (From: ${languages[languagefrom]}):`,
                    thingToTranslate)
                .addField(`Translation (To: ${languages[languageto]}):`,
                    res.text);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Something went wrong!");
        }
    }
};
