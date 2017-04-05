# XiaoBot
Public Source Code for the Discord Bot XiaoBot, a Discord bot coded in JavaScript with [discord.js](https://discord.js.org/#/) using the [Commando](https://github.com/Gawdl3y/discord.js-commando) command framework.

## Info
XiaoBot is a Discord bot with several features. A full list can be viewed in the documentation (coming soon).

## Adding it to Your Server
You can add XiaoBot to your server with [this link](https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=1345846343). 

> Note: Please do not change the permissions. It could break the bot.

## Home Server
You can join the home server with [this link](https://discord.gg/fqQF8mc).

## Modules & APIs
[discord.js](https://discord.js.org/#/), [commando](https://github.com/Gawdl3y/discord.js-commando), [pirate-speak](https://github.com/mikewesthad/pirate-speak), [google-translate-api](https://github.com/matheuss/google-translate-api), [zalgoize](https://github.com/clux/zalgolize), [hepburn](https://github.com/lovell/hepburn), [string-to-binary](https://www.npmjs.com/package/string-to-binary), [roman-numeral-converter-mmxvi](https://github.com/Cein-Markey/roman-numeral-conversion-library), [cowsay](https://github.com/piuccio/cowsay), [morse](https://github.com/ecto/morse), [superagent](https://github.com/visionmedia/superagent), [mathjs](http://mathjs.org/), [moment](http://momentjs.com), [moment-duration-format](https://github.com/jsmreese/moment-duration-format), [jimp](https://github.com/oliver-moran/jimp), [cheerio](https://cheerio.js.org/), [Wattpad API](https://developer.wattpad.com/docs/api), [Wordnik API](http://developer.wordnik.com/docs.html), [osu! API](https://osu.ppy.sh/p/api), [memegen.link](https://memegen.link/), [Yugioh Prices API](http://docs.yugiohprices.apiary.io/#), [YouTube Data API](https://developers.google.com/youtube/v3/), [Yoda Speak API](https://market.mashape.com/ismaelc/yoda-speak), [Discord Bots API](https://bots.discord.pw/api), [Today in History API](http://history.muffinlabs.com/#api), [jService API](http://jservice.io/), [Strawpoll API](https://github.com/strawpoll/strawpoll/wiki/API), [Urban Dictionary API](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation), [OMDB API](http://www.omdbapi.com/), [Yahoo Weather API](https://developer.yahoo.com/weather/)

## Self-Hosting
You can Self-Host the bot easily, provided you have API keys and a Discord Bot Token. [Node.js](https://nodejs.org/en/) is also required, with at least version 7.8.0 recommended.

APIs that require API Keys:

[Wattpad API](https://developer.wattpad.com/docs/api) | [Wordnik API](http://developer.wordnik.com/docs.html) | [osu! API](https://osu.ppy.sh/p/api) | [YouTube Data API](https://developers.google.com/youtube/v3/) | [Yoda Speak API](https://market.mashape.com/ismaelc/yoda-speak)

> Note: If you do self-host, you will need to go into the file `index.js` and remove the entries for requests to Discord Bots and Carbon.

You will also need a Discord App and Token. You can get those [here](https://discordapp.com/developers/applications). No support is provided for self-hosting, if you self-host, you should know how to do so. All API Keys and the Token should be placed in environment variables.

## Licensing
The bot is licensed under an [ISC license](https://opensource.org/licenses/ISC). See the file `LICENSE.md` for more information.
