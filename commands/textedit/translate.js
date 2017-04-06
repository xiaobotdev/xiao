const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const languages = {
    "auto": "Automatic",
    "af": "Afrikaans",
    "sq": "Albanian",
    "ar": "Arabic",
    "az": "Azerbaijani",
    "eu": "Basque",
    "bn": "Bengali",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "zh-cn": "Chinese Simplified",
    "zh-tw": "Chinese Traditional",
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
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarian",
    "is": "Icelandic",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "ko": "Korean",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "mk": "Macedonian",
    "ms": "Malay",
    "mt": "Maltese",
    "no": "Norwegian",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "es": "Spanish",
    "sw": "Swahili",
    "sv": "Swedish",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "yi": "Yiddish"
};

module.exports = class TranslateCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'translate',
            group: 'textedit',
            memberName: 'translate',
            description: 'Translates text to a given language. (;translate ja Give me the money!)',
            details: '**Codes:** af: Afrikaans, sq: Albanian, ar: Arabic, az: Azerbaijani, eu: Basque, bn: Bengali, be: Belarusian, bg: Bulgarian, ca: Catalan, zh-cn: Chinese Simplified, zh-tw: Chinese Traditional, hr: Croatian, cs: Czech, da: Danish, nl: Dutch, en: English, eo: Esperanto, et: Estonian, tl: Filipino, fi: Finnish, fr: French, gl: Galician, ka: Georgian, de: German, el: Greek, gu: Gujarati, ht: Haitian Creole, iw: Hebrew, hi: Hindi, hu: Hungarian, is: Icelandic, id: Indonesian, ga: Irish, it: Italian, ja: Japanese, kn: Kannada, ko: Korean, la: Latin, lv: Latvian, lt: Lithuanian, mk: Macedonian, ms: Malay, mt: Maltese, no: Norwegian, fa: Persian, pl: Polish, pt: Portuguese, ro: Romanian, ru: Russian, gd: Scots Gaelic, sr: Serbian, sk: Slovak, sl: Slovenian, es: Spanish, sw: Swahili, sv: Swedish, ta: Tamil, te: Telugu, th: Thai, tr: Turkish, uk: Ukrainian, ur: Urdu, vi: Vietnamese, cy: Welsh, yi: Yiddish',
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
        const languageto = args.to.toLowerCase();
        const thingToTranslate = args.text;
        try {
            const response = await request
                .get('https://translate.googleapis.com/translate_a/single')
                .query({
                    client: 'gtx',
                    sl: 'auto',
                    tl: languageto,
                    dt: 't',
                    q: thingToTranslate
                });
            const data = JSON.parse(response.text);
            const translated = data[0][0][0];
            const languagefrom = data[8][3][0];
            const embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .addField(`Input (From: ${languages[languagefrom]}):`,
                    thingToTranslate)
                .addField(`Translation (To: ${languages[languageto]}):`,
                    translated);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
