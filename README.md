# XiaoBot
<div align="center">
  <br />
  <p>
    <a href="https://discord.gg/fqQF8mc"><img src="https://discordapp.com/api/guilds/252317073814978561/embed.png" alt="Discord Server" /></a>
  </p>
</div>
Public Source Code for the Discord Bot XiaoBot, a Discord bot coded in JavaScript with [discord.js](https://discord.js.org/#/) using the [Commando](https://github.com/Gawdl3y/discord.js-commando) command framework.

## Info
XiaoBot is a Discord bot with several features. A full list can be viewed in the documentation (coming soon).

## Adding it to Your Server
You can add XiaoBot to your server with [this link](https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=1345846343). 

> Note: Please do not change the permissions. It could break the bot.

## Home Server
You can join the home server with [this link](https://discord.gg/fqQF8mc).

## Modules
[discord.js](https://discord.js.org/#/), [commando](https://github.com/Gawdl3y/discord.js-commando), [zalgoize](https://github.com/clux/zalgolize), [superagent](https://github.com/visionmedia/superagent), [mathjs](http://mathjs.org/), [moment](http://momentjs.com), [moment-duration-format](https://github.com/jsmreese/moment-duration-format), [jimp](https://github.com/oliver-moran/jimp), [cheerio](https://cheerio.js.org/)

## APIs
[Wattpad](https://developer.wattpad.com/docs/api), [Wordnik](http://developer.wordnik.com/docs.html), [osu!](https://osu.ppy.sh/p/api), [memegen.link](https://memegen.link/), [Yugioh Prices](http://docs.yugiohprices.apiary.io/#), [YouTube Data](https://developers.google.com/youtube/v3/), [Discord Bots](https://bots.discord.pw/api), [Today in History](http://history.muffinlabs.com/#api), [jService](http://jservice.io/), [Urban Dictionary](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation), [OMDB](http://www.omdbapi.com/), [Yahoo Weather](https://developer.yahoo.com/weather/), [Google Static Maps](https://developers.google.com/maps/documentation/static-maps/), [Strawpoll](https://github.com/strawpoll/strawpoll/wiki/API), [rrrather](http://www.rrrather.com/botapi), [SoundCloud](https://developers.soundcloud.com/)

## Self-Hosting
You can Self-Host the bot easily, provided you have API keys and a Discord Bot Token. [Node.js](https://nodejs.org/en/) is also required, with at least version 7.8.0 recommended.

APIs that require API Keys:

[Wattpad](https://developer.wattpad.com/docs/api) | [Wordnik](http://developer.wordnik.com/docs.html) | [osu!](https://osu.ppy.sh/p/api) | [YouTube Data](https://developers.google.com/youtube/v3/) | [SoundCloud](https://developers.soundcloud.com/)

> Note: If you do self-host, you will need to go into the file `index.js` and remove the entries for requests to Discord Bots and Carbon.

You will also need a Discord App and Token. You can get those [here](https://discordapp.com/developers/applications). No support is provided for self-hosting, if you self-host, you should know how to do so. All API Keys and the Token should be placed in environment variables.

## Licensing
The bot is licensed under an [ISC license](https://opensource.org/licenses/ISC). See the file `LICENSE.md` for more information.
