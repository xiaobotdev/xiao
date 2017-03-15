const commando = require('discord.js-commando');
const Discord = require('discord.js');
const config = require("../../config.json");
const moment = require('moment');
require('moment-duration-format');

class InfoCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'info', 
            group: 'botinfo',
            memberName: 'info',
            description: 'Gives some bot info. (;info)',
            examples: [';info']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let guilds = this.client.guilds.size;
        let users = this.client.users.size;
        this.client.shard.fetchClientValues('guilds.size').then(results => {
            const embed = new Discord.RichEmbed()
            .setTitle('Welcome to XiaoBot!')
            .setAuthor(this.client.user.username, this.client.user.avatarURL)
            .setColor(0x00AE86)
            .setDescription('XiaoBot is your personal companion for your Discord Server!')
            .setFooter('©2017 dragonfire535', this.client.user.avatarURL)
            .setThumbnail(this.client.user.avatarURL)
            .setURL('http://dragonfire535.weebly.com/xiaobot.html')
            .addField('Commands',
            "There are a variety of commands XiaoBot can use! Use ';help' to view a list of all commands!")
            .addField('Servers',
            guilds + "/" + results.reduce((prev, val) => prev + val, 0), true)
            .addField('Shards',
            this.client.options.shardCount + " (This is Shard: " + this.client.shard.id + ")", true)
            .addField('Commands',
            config.commandcount, true)
            .addField('Owner',
            "dragonfire535#8081", true)
            .addField('Uptime',
            moment.duration(this.client.uptime).format('d[d]h[h]m[m]s[s]'), true)
            .addField('Source Code',
            "[View Here](https://github.com/dragonfire535/xiaobot)", true)
            .addField('Memory Usage', 
            `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('Library',
            "[discord.js](https://discord.js.org/#/) + [discord.js-commando](https://github.com/Gawdl3y/discord.js-commando)", true)
            .addField('Modules',
            "[cleverbot-node](https://github.com/fojas/cleverbot-node), [pirate-speak](https://github.com/mikewesthad/pirate-speak), [JIMP](https://github.com/oliver-moran/jimp), [google-translate-api](https://github.com/matheuss/google-translate-api), [urban](https://github.com/mvrilo/urban), [zalgoize](https://github.com/clux/zalgolize), [hepburn](https://github.com/lovell/hepburn), [yahoo-weather](https://github.com/mamal72/node-yahoo-weather), [imdb-api](https://github.com/worr/node-imdb-api), [request-promise](https://github.com/request/request-promise), [mathjs](http://mathjs.org/), [string-to-binary](https://www.npmjs.com/package/string-to-binary), [google](https://github.com/jprichardson/node-google), [roman-numeral-converter-mmxvi](https://github.com/Cein-Markey/roman-numeral-conversion-library), [cowsay](https://github.com/piuccio/cowsay), [moment](http://momentjs.com), [moment-duration-format](https://github.com/jsmreese/moment-duration-format)")
            .addField('Other Credit',
            "[Cleverbot API](https://www.cleverbot.com/api/), [Wattpad API](https://developer.wattpad.com/docs/api), [Wordnik API](http://developer.wordnik.com/docs.html), [osu! API](https://osu.ppy.sh/p/api), [memegen.link](https://memegen.link/), [Yugioh Prices API](http://docs.yugiohprices.apiary.io/#), [YouTube Data API](https://developers.google.com/youtube/v3/), [Yoda Speak API](https://market.mashape.com/ismaelc/yoda-speak), [Discord Bots API](https://bots.discord.pw/api), [Today in History API](http://history.muffinlabs.com/), [Heroku](https://www.heroku.com/)")
            .addField('My Server',
            "[Click Here to Join!](https://discord.gg/fqQF8mc)")
            .addField('Invite Link:',
            "[Click Here to Add Me to Your Server!](https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=519238)");
            message.channel.sendEmbed(embed).catch(console.error);
        });
    }
}
 
module.exports = InfoCommand;