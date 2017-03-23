const commando = require('discord.js-commando');
const Discord = require('discord.js');
const translate = require('google-translate-api');

const languages =  {
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
            examples: [';translate ja Give me the the money!', ';translate list']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let [languageto] = message.content.toLowerCase().split(" ").slice(1);
        let thingToTranslate = message.content.split(" ").slice(2).join(" ");
        if (languageto === "list") {
            return message.channel.send("‘af': 'Afrikaans’\n’sq': 'Albanian'\n'ar': 'Arabic’\n’hy': 'Armenian’\n’az': 'Azerbaijani’\n’eu': 'Basque’\n’be': 'Belarusian’\n’bn': 'Bengali’\n’bs': 'Bosnian’\n’bg': 'Bulgarian’\n’ca': 'Catalan’\n’ceb': 'Cebuano’\n’ny': 'Chichewa’\n’zh-cn': 'Chinese Simplified’\n’zh-tw': 'Chinese Traditional’\n’co': 'Corsican’\n’hr': 'Croatian’\n’cs': 'Czech’\n’da': 'Danish’\n’nl': 'Dutch’\n’en': 'English’\n’eo': 'Esperanto’\n’et': 'Estonian’\n’tl': 'Filipino’\n’fi': 'Finnish’\n’fr': 'French’\n’fy': 'Frisian’\n’gl': 'Galician’\n’ka': 'Georgian’\n’de': 'German’\n’el': 'Greek’\n’gu': 'Gujarati’\n’ht': 'Haitian Creole’\n’ha': 'Hausa’\n’haw': 'Hawaiian’\n’iw': 'Hebrew’\n’hi': 'Hindi’\n’hmn': 'Hmong’\n’hu': 'Hungarian’\n’is': 'Icelandic’\n’ig': 'Igbo’\n’id': 'Indonesian’\n’ga': 'Irish’\n’it': 'Italian’\n’ja': 'Japanese’\n’jw': 'Javanese’\n’kn': 'Kannada’\n’kk': 'Kazakh’\n’km': 'Khmer’\n’ko': 'Korean’\n’ku': 'Kurdish (Kurmanji)’\n’ky': 'Kyrgyz’\n’lo': 'Lao’\n’la': 'Latin’\n’lv': 'Latvian’\n’lt': 'Lithuanian’\n’lb': 'Luxembourgish’\n’mk': 'Macedonian’\n’mg': 'Malagasy’\n’ms': 'Malay’\n’ml': 'Malayalam’\n’mt': 'Maltese’\n’mi': 'Maori’\n’mr': 'Marathi’\n’mn': 'Mongolian’\n’my': 'Myanmar (Burmese)’\n’ne': 'Nepali’\n’no': 'Norwegian’\n’ps': 'Pashto’\n’fa': 'Persian’\n’pl': 'Polish’\n’pt': 'Portuguese’\n’ma': 'Punjabi’\n’ro': 'Romanian’\n’ru': 'Russian’\nsm': 'Samoan’\n’gd': 'Scots Gaelic’\n’sr': 'Serbian’\n’st': 'Sesotho’\n’sn': 'Shona’\n’sd': 'Sindhi’\n’si': 'Sinhala’\n’sk': 'Slovak’\n’sl': 'Slovenian’\n’so': 'Somali’\n’es': 'Spanish’\n’su': 'Sudanese’\n’sw': 'Swahili’\n’sv': 'Swedish’\n’tg': 'Tajik’\n’ta': 'Tamil’\n’te': 'Telugu’\n’th': 'Thai’\n’tr': 'Turkish’\n’uk': 'Ukrainian’\n’ur': 'Urdu’\n’uz': 'Uzbek’\n’vi': 'Vietnamese’\n’cy': 'Welsh’\n’xh': 'Xhosa’\n’yi': 'Yiddish’\n’yo': 'Yoruba’\n’zu': 'Zulu'");
        }
        else if (languages[languageto]) {
            if (!thingToTranslate) {
                return message.channel.send(":x: Error! Nothing to translate!");
            }
            else if (thingToTranslate.length > 200) {
                return message.channel.send(":x: Error! Please keep translations below 200 characters!");
            }
            else {
                return translate(thingToTranslate, {
                    to: languageto
                }).then(res => {
                    let languagefrom = res.from.language.iso.toLowerCase();
                    const embed = new Discord.RichEmbed()
                        .setColor(0x00AE86)
                        .addField(`Input (From: ${languages[languagefrom]}):`,
                            thingToTranslate)
                        .addField(`Translation (To: ${languages[languageto]}):`,
                            res.text);
                    return message.channel.sendEmbed(embed).catch(console.error);
                }).catch(err => {
                    console.log(err);
                    return message.channel.send(":x: Error! Something went wrong!");
                });
            }
        }
        else {
            return message.channel.send(":x: Error! Language not found! Use `;translate list` to view a list of translate codes!");
        }
    }
};
