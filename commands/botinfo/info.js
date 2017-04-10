const commando = require('discord.js-commando');
const Discord = require('discord.js');
const pkg = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = class InfoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'info',
            aliases: [
                'data',
                'information'
            ],
            group: 'botinfo',
            memberName: 'info',
            description: 'Gives some bot info. (;info)',
            examples: [';info'],
            args: [{
                key: 'shardID',
                prompt: 'Which Shard would you like to get data for?',
                type: 'integer',
                default: ''
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const shardID = args.shardID || this.client.shard.id;
        if (shardID > this.client.options.shardCount - 1 || shardID < 0) {
            return message.say(':x: Error! Invalid Shard!');
        }
        const memory = await this.client.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 / 1024)');
        const uptime = await this.client.shard.fetchClientValues('uptime');
        const guilds = await this.client.shard.fetchClientValues('guilds.size');
        const embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setFooter(`©2017 dragonfire535 | Version ${pkg.version} | Created ${moment.duration(Date.now() - this.client.user.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago!`)
            .addField('Servers',
                `${guilds[shardID]} / ${guilds.reduce((prev, val) => prev + val, 0)}`, true)
            .addField('Shards',
                `${this.client.options.shardCount} (${shardID})`, true)
            .addField('Commands',
                '113', true)
            .addField('Owner',
                'dragonfire535#8081', true)
            .addField('Source Code',
                '[View Here](https://github.com/dragonfire535/xiaobot)', true)
            .addField('Memory Usage',
                `${memory[shardID]}MB`, true)
            .addField('Uptime',
                moment.duration(uptime[shardID]).format('d[d]h[h]m[m]s[s]'), true)
            .addField('Node Version',
                process.version, true)
            .addField('Library',
                '[discord.js](https://discord.js.org/#/)', true)
            .addField('Modules',
                '[commando](https://github.com/Gawdl3y/discord.js-commando), [pirate-speak](https://github.com/mikewesthad/pirate-speak), [zalgoize](https://github.com/clux/zalgolize), [hepburn](https://github.com/lovell/hepburn), [string-to-binary](https://www.npmjs.com/package/string-to-binary), [roman-numeral-converter-mmxvi](https://github.com/Cein-Markey/roman-numeral-conversion-library), [cowsay](https://github.com/piuccio/cowsay), [morse](https://github.com/ecto/morse), [superagent](https://github.com/visionmedia/superagent), [mathjs](http://mathjs.org/), [moment](http://momentjs.com), [moment-duration-format](https://github.com/jsmreese/moment-duration-format), [jimp](https://github.com/oliver-moran/jimp), [cheerio](https://cheerio.js.org/)')
            .addField('APIs',
                '[Wattpad](https://developer.wattpad.com/docs/api), [Wordnik](http://developer.wordnik.com/docs.html), [osu!](https://osu.ppy.sh/p/api), [memegen.link](https://memegen.link/), [Yugioh Prices](http://docs.yugiohprices.apiary.io/#), [YouTube Data](https://developers.google.com/youtube/v3/), [Yoda Speak](https://market.mashape.com/ismaelc/yoda-speak), [Discord Bots](https://bots.discord.pw/api), [Today in History](http://history.muffinlabs.com/#api), [jService](http://jservice.io/), [Strawpoll](https://github.com/strawpoll/strawpoll/wiki/API), [Urban Dictionary](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation), [OMDB](http://www.omdbapi.com/), [Yahoo Weather](https://developer.yahoo.com/weather/), [Yandex.Translate](https://translate.yandex.com/developers), [Wikipedia](https://en.wikipedia.org/w/api.php)');
        return message.embed(embed);
    }
};
