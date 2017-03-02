const commando = require('discord.js-commando');
const Discord = require('discord.js');
const translate = require('google-translate-api');
const languages = require('./languages.json');

class TranslateCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'translate', 
            group: 'textedit',
            memberName: 'translate',
            description: 'Translates text to a given language. (;translate ja Give me the money!) (;translate list to see avaliable language codes!)',
            examples: [';translate ja Give me the the money!', ';translate']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let [languageto] = message.content.toLowerCase().split(" ").slice(1);
        let messagecontent = message.content.split(" ").slice(2).join(" ");
        if(languageto === "list") {
            message.channel.sendMessage("‘af': 'Afrikaans’\n’sq': 'Albanian'\n'ar': 'Arabic’\n’hy': 'Armenian’\n’az': 'Azerbaijani’\n’eu': 'Basque’\n’be': 'Belarusian’\n’bn': 'Bengali’\n’bs': 'Bosnian’\n’bg': 'Bulgarian’\n’ca': 'Catalan’\n’ceb': 'Cebuano’\n’ny': 'Chichewa’\n’zh-cn': 'Chinese Simplified’\n’zh-tw': 'Chinese Traditional’\n’co': 'Corsican’\n’hr': 'Croatian’\n’cs': 'Czech’\n’da': 'Danish’\n’nl': 'Dutch’\n’en': 'English’\n’eo': 'Esperanto’\n’et': 'Estonian’\n’tl': 'Filipino’\n’fi': 'Finnish’\n’fr': 'French’\n’fy': 'Frisian’\n’gl': 'Galician’\n’ka': 'Georgian’\n’de': 'German’\n’el': 'Greek’\n’gu': 'Gujarati’\n’ht': 'Haitian Creole’\n’ha': 'Hausa’\n’haw': 'Hawaiian’\n’iw': 'Hebrew’\n’hi': 'Hindi’\n’hmn': 'Hmong’\n’hu': 'Hungarian’\n’is': 'Icelandic’\n’ig': 'Igbo’\n’id': 'Indonesian’\n’ga': 'Irish’\n’it': 'Italian’\n’ja': 'Japanese’\n’jw': 'Javanese’\n’kn': 'Kannada’\n’kk': 'Kazakh’\n’km': 'Khmer’\n’ko': 'Korean’\n’ku': 'Kurdish (Kurmanji)’\n’ky': 'Kyrgyz’\n’lo': 'Lao’\n’la': 'Latin’\n’lv': 'Latvian’\n’lt': 'Lithuanian’\n’lb': 'Luxembourgish’\n’mk': 'Macedonian’\n’mg': 'Malagasy’\n’ms': 'Malay’\n’ml': 'Malayalam’\n’mt': 'Maltese’\n’mi': 'Maori’\n’mr': 'Marathi’\n’mn': 'Mongolian’\n’my': 'Myanmar (Burmese)’\n’ne': 'Nepali’\n’no': 'Norwegian’\n’ps': 'Pashto’\n’fa': 'Persian’\n’pl': 'Polish’\n’pt': 'Portuguese’\n’ma': 'Punjabi’\n’ro': 'Romanian’\n’ru': 'Russian’\nsm': 'Samoan’\n’gd': 'Scots Gaelic’\n’sr': 'Serbian’\n’st': 'Sesotho’\n’sn': 'Shona’\n’sd': 'Sindhi’\n’si': 'Sinhala’\n’sk': 'Slovak’\n’sl': 'Slovenian’\n’so': 'Somali’\n’es': 'Spanish’\n’su': 'Sudanese’\n’sw': 'Swahili’\n’sv': 'Swedish’\n’tg': 'Tajik’\n’ta': 'Tamil’\n’te': 'Telugu’\n’th': 'Thai’\n’tr': 'Turkish’\n’uk': 'Ukrainian’\n’ur': 'Urdu’\n’uz': 'Uzbek’\n’vi': 'Vietnamese’\n’cy': 'Welsh’\n’xh': 'Xhosa’\n’yi': 'Yiddish’\n’yo': 'Yoruba’\n’zu': 'Zulu'");
        } else if(languages.entries[languageto]) {
            if(messagecontent === "") {
                message.reply(":x: Error! Nothing to translate!");
            } else {
                translate(messagecontent, {to: languageto}).then(res => {
                    const embed = new Discord.RichEmbed()
                    .setColor(0x00AE86)
                    .addField('Input:',
                    messagecontent)
                    .addField('Translation (To: ' + languages.entries[languageto] + '):',
                    res.text);
                    message.channel.sendEmbed(embed).catch(console.error);
                }).catch(err => {
                    console.error(err);
                });
            }
        } else {
            message.reply(":x: Error! Language not found!");
        }
    }
}

module.exports = TranslateCommand;