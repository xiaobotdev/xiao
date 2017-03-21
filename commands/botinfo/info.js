const commando = require('discord.js-commando');
const Discord = require('discord.js');
const config = require("../../config.json");
const moment = require('moment');
require('moment-duration-format');

module.exports = class InfoCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'info',
			aliases: [
				'data',
				'information'
			],
            group: 'botinfo',
            memberName: 'info',
            description: 'Gives some bot info. (;info)',
            examples: [';info']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        this.client.shard.fetchClientValues('guilds.size').then(guilds => {
            this.client.shard.fetchClientValues('voiceConnections.size').then(vCConnections => {
                const embed = new Discord.RichEmbed()
                .setTitle('Welcome to XiaoBot!')
                .setAuthor(this.client.user.username, this.client.user.avatarURL)
                .setColor(0x00AE86)
                .setDescription('XiaoBot is your personal companion for your Discord Server!')
                .setFooter('©2017 dragonfire535 | Created ' + moment.duration(this.client.user.createdTimestamp - Date.now()).format('y[ years], M[ months], w[ weeks, and ]d[ days]') + ' ago!')
                .setThumbnail(this.client.user.avatarURL)
                .setURL('http://dragonfire535.weebly.com/xiaobot.html')
                .addField('Commands',
                "There are a variety of commands XiaoBot can use! Use ';help' to view a list of all commands!")
                .addField('Servers',
                this.client.guilds.size + " / " + guilds.reduce((prev, val) => prev + val, 0), true)
                .addField('Shards',
                this.client.options.shardCount + " (This is Shard: " + this.client.shard.id + ")", true)
                .addField('Commands',
                config.commandCount, true)
                .addField('Owner',
                "dragonfire535#8081", true)
                .addField('Source Code',
                "[View Here](https://github.com/dragonfire535/xiaobot)", true)
                .addField('Memory Usage', 
                `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
                .addField('Uptime',
                moment.duration(this.client.uptime).format('d[d]h[h]m[m]s[s]'), true)
                .addField('Node Version',
                process.version, true)
                .addField('Voice Connections',
                this.client.voiceConnections.size + " / " + vCConnections.reduce((prev, val) => prev + val, 0), true)
                .addField('Library',
                "[discord.js](https://discord.js.org/#/) / [commando](https://github.com/Gawdl3y/discord.js-commando)", true)
                .addField('Modules',
                "[cleverbot-node](https://github.com/fojas/cleverbot-node), [pirate-speak](https://github.com/mikewesthad/pirate-speak), [google-translate-api](https://github.com/matheuss/google-translate-api), [urban](https://github.com/mvrilo/urban), [zalgoize](https://github.com/clux/zalgolize), [hepburn](https://github.com/lovell/hepburn), [yahoo-weather](https://github.com/mamal72/node-yahoo-weather), [imdb-api](https://github.com/worr/node-imdb-api), [string-to-binary](https://www.npmjs.com/package/string-to-binary), [roman-numeral-converter-mmxvi](https://github.com/Cein-Markey/roman-numeral-conversion-library), [cowsay](https://github.com/piuccio/cowsay), [morse](https://github.com/ecto/morse)")
                .addField('Utility Modules',
                "[superagent](https://github.com/visionmedia/superagent), [mathjs](http://mathjs.org/), [moment](http://momentjs.com), [moment-duration-format](https://github.com/jsmreese/moment-duration-format), [opusscript](https://github.com/abalabahaha/opusscript), [jimp](https://github.com/oliver-moran/jimp)")
                .addField('APIs',
                "[Cleverbot API](https://www.cleverbot.com/api/), [Wattpad API](https://developer.wattpad.com/docs/api), [Wordnik API](http://developer.wordnik.com/docs.html), [osu! API](https://osu.ppy.sh/p/api), [memegen.link](https://memegen.link/), [Yugioh Prices API](http://docs.yugiohprices.apiary.io/#), [YouTube Data API](https://developers.google.com/youtube/v3/), [Yoda Speak API](https://market.mashape.com/ismaelc/yoda-speak), [Discord Bots API](https://bots.discord.pw/api), [Today in History API](http://history.muffinlabs.com/)")
                .addField('Other Credit',
                "[Heroku](https://www.heroku.com/), [Cloud9](https://c9.io/), [heroku-buildpack-ffmpeg-latest](https://elements.heroku.com/buildpacks/jonathanong/heroku-buildpack-ffmpeg-latest)")
                .addField('My Server',
                "[Click Here to Join!](https://discord.gg/fqQF8mc)")
                .addField('Invite Link:',
                "[Click Here to Add Me to Your Server!](https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=1345846343)");
                message.channel.sendEmbed(embed).catch(console.error);
            });
        });
    }
};