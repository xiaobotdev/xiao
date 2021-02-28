<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="Xiao" src="https://i.imgur.com/R0D0f39.png">  

# Xiao
[![Build Status](https://github.com/dragonfire535/xiao/workflows/Lint/badge.svg?branch=master&event=push)](https://github.com/dragonfire535/xiao/actions)
[![Donate on PayPal](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.me/dragonfire535)
[![Discord](https://discordapp.com/api/guilds/252317073814978561/embed.png)](https://discord.gg/mTr83zt)

Xiao is a Discord bot coded in JavaScript with
[discord.js](https://discord.js.org/) using the
[Commando](https://github.com/discordjs/Commando) command framework. With over
500 commands, she is one of the most feature-rich bots out there. Formerly
"XiaoBot".

# [Home Server](https://discord.gg/mTr83zt) | [Invite](https://discordapp.com/api/oauth2/authorize?client_id=278305350804045834&permissions=104721601&scope=bot)

## Table of Contents

- [Copyright](#copyright)
- [Permissions](#permissions)
- [Fun Information](#fun-information)
- [Installing](#installing)
	* [Before You Begin](#before-you-begin)
	* [Windows](#windows)
	* [Mac](#mac)
	* [Ubuntu and other Debian-based systems](#ubuntu-and-other-debian-based-systems)
- [Filling Out Your .env File](#filling-out-your-env-file)
	* [Discord-related Info](#discord-related-info)
	* [Emoji IDs](#emoji-ids)
	* [API Keys, IDs, and Secrets](#api-keys-ids-and-secrets)
	* [Imgur Album IDs](#imgur-album-ids)
- [Related Bots](#related-bots)
- [Options](#Options)
	* [General Options](#general-options)
	* [Phone Options](#phone-options)
	* [Portal Options](#portal-options)
- [Commands](#commands)
	* [Utility](#utility)
	* [Utility (Voice)](#utility-voice)
	* [Utility (Owner)](#utility-owner)
	* [Discord Information](#discord-information)
	* [Random Response](#random-response)
	* [Random Image](#random-image)
	* [Seeded Randomizers](#seeded-randomizers)
	* [Single Response](#single-response)
	* [Automatic Response](#automatic-response)
	* [Events](#events)
	* [Search](#search)
	* [Pokédex](#pokédex)
	* [Analyzers](#analyzers)
	* [Single-Player Games](#single-player-games)
	* [Multi-Player Games](#multi-player-games)
	* [Image Manipulation](#image-manipulation)
	* [Avatar Manipulation](#avatar-manipulation)
	* [Meme Generators](#meme-generators)
	* [Text Manipulation](#text-manipulation)
	* [Number Manipulation](#number-manipulation)
	* [Play Audio](#play-audio)
	* [Music](#music)
	* [Reminders](#reminders)
	* [Phone](#phone)
	* [Coding Tools](#coding-tools)
	* [Other](#other)
	* [Roleplay](#roleplay)
- [Other Features](#other-features)
- [Licensing](#licensing)
- [Credit](#credit)

## Copyright

- ©2017-2021 dragonfire535#8081
- Xiao Pai/Rune Factory 4: ©2012 Marvelous Inc.
- Avatar Art: ©2018 airful

## Permissions

Xiao needs several permissions to be able to do what she does. Below
is every permission Xiao asks for, and what commands you lose if you
don't grant that permission.

- **Create Instant Invite** is needed to allow owners to join your server to test if needed.
	* You lose no commands by turning this off, but you might hinder support.
- **View Audit Log** is not needed yet, but is something Xiao might utilize in the future.
- **Change Nickname** is not _needed_, but is included as a basic permission.
- **View Channels** is required for every single command to work.
- **Send Messages** is required for every single command to work.
- **Manage Messages** allows Xiao to use the `prune` command.
	* It also allows the `say` command to delete your message, but the command will still work without it.
- **Embed Links** is required to allow commands that send embeds to work. Too many commands to list use it.
- **Attach Files** is required to allow commands that send files to work. Too many commands to list use it.
- **Read Message History** allows Xiao to use the `first-message` and `prune` commands.
	* It is also required to allow Xiao to react to messages alongside "Add Reactions".
- **Mention @everyone, @here, and All Roles** allows Xiao to use the `where-is-everybody` command.
- **Use External Emojis** allows Xiao to use custom emoji in certain commands.
	* While the commands benefit from it, it is not required for the commands to work.
- **Add Reactions** allows Xiao to use commands that add reactions to messages in certain commands.
	* While the commands benefit from it, it is not required for the commands to work.
	* "Read Message History" is also required to allow Xiao to react.
- **Connect** allows Xiao to connect to voice channels. This is needed for commands that play audio.
- **Speak** allows Xiao to speak in voice channels. This is needed for commands that play audio.
- **Use Voice Activity** is not _needed_, but is included as an extra precaution for voice commands.

## Fun Information

- 500+ commands
- 35,000+ lines of JavaScript
- 65,000+ lines of JSON data
- 4 years of development

## Installing

### Before You Begin

1. Make sure you have installed [Node.js](https://nodejs.org/en/) (you will need **at least v15.0.0**) and [Git](https://git-scm.com/).
	- If on Windows, [make sure to check the box in the section of the installer for "Tools for Native Modules"](https://i.imgur.com/RMrlz2S.png).
2. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
3. Run `cd xiao` to move into the folder that you just created.
4. Create a file named `.env` and fill it out as shown in `.env.example`.

### Windows

1. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows).
2. [Follow these instructions to install ffmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows).
3. [Install ImageMagick](https://imagemagick.org/script/download.php).
4. [Follow these instructions to install Redis](https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows). Remember to set up a password!
5. Run `npm i --production` in the folder you cloned the bot.
6. Run `npm i -g pm2` to install PM2.
7. Run `pm2 start Xiao.js --name xiao` to run the bot.

### Mac

1. Use a real (cheaper!) OS to host your bot.
2. ???
3. Profit.

### Ubuntu and other Debian-based systems

1. Run `apt update`.
2. Run `apt upgrade` to install the latest dependencies of your distro.
3. Run `apt install python` to install python.
4. Run `apt install ffmpeg` to install ffmpeg.
5. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Ubuntu-and-other-Debian-based-systems).
6. Run `apt install liblqr-1-0-dev liblqr-1-0` to install liblqr (needed for ImageMagick).
7. [Follow these instructions to install ImageMagick](https://www.tecmint.com/install-imagemagick-on-debian-ubuntu/).
8. [Follow these instructions to set up Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). Remember to set up a password!
9. Run `apt install libtool` so sodium can compile if necessary. **(Optional)**
10. Run `npm i --production` in the folder you cloned the bot.
11. Run `npm i -g pm2` to install PM2.
12. Run `pm2 start Xiao.js --name xiao` to run the bot.

## Filling Out Your .env File

Getting _all_ the API keys for your `.env` file can be a pain on a
bot this big, I know. That's why I've compiled a list here of where
to go to get _every single API key_. Note, not all of these are free.
The difficulty in getting all of these keys is why I recommend
[inviting Xiao](#invite) rather than self-hosting her.

### Discord-related Info

* `XIAO_TOKEN` can be obtained at the [Discord Developer Portal](https://discord.com/developers/applications/).
* `OWNERS` is a comma-seperated list of Discord User IDs.
* `GIRLFRIEND_USER_ID` is a Discord User ID for your lover. It rigs commands like `coolness` and `cuteness`. Totally optional, loners (like me) can leave it out.
* `XIAO_PREFIX` is the prefix you want the bot to have. Like `x;`.
* `INVITE` is an invite link to a Discord server. The whole thing, not just the code.
* `XIAO_WEBHOOK_ID` is the ID of the webhook you want the `webhook` command to use.
* `XIAO_WEBHOOK_TOKEN` is the token of the webhook you want the `webhook` command to use.
* `POSTER_ID` is the ID of the webhook used for Xiao's meme poster. Not required.
* `POSTER_TOKEN` is the token of the webhook used for Xiao's meme poster. Not required.
* `POSTER_TIME` is the interval to wait between when posting memes using Xiao's meme poster. Not required and defaults to one hour.
* `REPORT_CHANNEL_ID` is the ID of the Discord channel you want to send messages from `report` to. Not required, and if not provided the report command simply DMs the owner.
* `JOIN_LEAVE_CHANNEL_ID` is the ID of the Discord channel to send a message to whenever a new server adds or removes the bot. Not required.

### Redis Info

This is information for connecting to Redis.

* `REDIS_HOST` is the host for your Redis connection. Probably `127.0.0.1`.
* `REDIS_PASS` is the password for your Redis connection.

### Emoji IDs

All the emoji IDs are the IDs of Discord custom emoji. You need to
make these yourself, but none are required, and any left out will
simply switch to basic text.

* `GOLD_FISH` and `SILVER_FISH` are used in `neko-atsume-password`.
* `MOCKING` is used in `mocking`.
* `PORTAL` is used in `portal-send`.
* `FLANKER`, `FRONT_LINE`, `SUPPORT`, and `DAMAGE` are used in `paladins`.
* `LOADING` is used in commands that need to load for a long time before giving a response, such as `vocodes` and `dec-talk`.
* `MEGA_EVOLVE` is used in `pokedex`.

### API Keys, IDs, and Secrets

Here's where things get LONG. If you're greeted with a log-in page
when clicking any of these links, you'll need an account for that
API. All are free unless otherwise stated.

* `ALPHA_VANTAGE_KEY` can be obtained at the [Alpha Vantage website](https://www.alphavantage.co/support/#api-key).
* `ANILIST_USERNAME` is the username of an [Anilist](https://anilist.co/) user. Not required, and defaults to `dragonfire535`.
* `BITLY_KEY` can be obtained by getting a [Generic Access Token](https://bitly.is/accesstoken).
* `CLEARBIT_KEY` can be obtained at the [Clearbit dashboard](https://dashboard.clearbit.com/).
* `CLEVERBOT_KEY` can be obtained at the [Cleverbot API page](https://www.cleverbot.com/api/). It's not free.
* `CUSTOM_SEARCH_ID` can be obtained by following [this tutorial](https://developers.google.com/custom-search/docs/tutorial/creatingcse).
* `DEVIANTART_ID` and `DEVIANTART_SECRET` can be obtained by registering an application at the [Deviantart developer portal](https://www.deviantart.com/developers/).
* `FACEPLUSPLUS_KEY` and `FACEPLUSPLUS_SECRET` can be obtained at the [FacePlusPlus console](https://console.faceplusplus.com/).
* `FLICKR_KEY` can be obtained by going to [Flickr's App Garden](https://www.flickr.com/services/) and clicking "Get an API Key".
* `GIPHY_KEY` can be obtained at the [Giphy developer portal](https://developers.giphy.com/).
* `GITHUB_ACCESS_TOKEN` can be obtained by [creating an access token](https://github.com/settings/tokens).
* `GOOGLE_CALENDAR_ID` is an email for a Google calendar to be used in the `calendar` command. For example, US Holidays are `en.usa#holiday@​group.v.calendar.google.com`.
* `PERSONAL_GOOGLE_CALENDAR_ID` is basically the above, but for extra events. It's named personal as I use my personal email for the events. It's not required, and if not provided will just be skipped.
* `GOOGLE_KEY` can be obtained at the [Google Developer Console](https://console.developers.google.com/). Be sure to click "Enable APIs and Services" and enable the following APIs:
	- [YouTube Data API](https://console.developers.google.com/apis/library/youtube.googleapis.com)
	- [Custom Search API](https://console.developers.google.com/apis/library/customsearch.googleapis.com)
	- [Maps Static API](https://console.developers.google.com/apis/library/static-maps-backend.googleapis.com)
	- [Google Calendar API](https://console.developers.google.com/apis/library/calendar-json.googleapis.com)
	- [Books API](https://console.developers.google.com/apis/library/books.googleapis.com)
	- [Safe Browsing API](https://console.developers.google.com/apis/library/safebrowsing.googleapis.com)
	- Go to the [Perspective API website](https://www.perspectiveapi.com/#/home) to set up the Perspective API.
* `GOV_KEY` can be obtained at the [NASA Open APIs portal](https://api.nasa.gov/).
* `IDIOT_PAGE_ID` is the ID of a Wikipedia article for use in the `idiot` command. Not required, and defaults to `Donald_Trump`. If this offends you, I don't care.
* `IMGUR_KEY` can be obtained by [Registering an Application at the Imgur website](https://api.imgur.com/oauth2/addclient).
* `OPENWEATHERMAP_KEY` can be obtained at the [OpenWeatherMap website](https://openweathermap.org/price). Click "Get API Key" on the plan you want (probably Free).
* `OSU_KEY` can be obtained by [signing up at the osu! API page](https://osu.ppy.sh/p/api/). Whether this link takes you to the right page or not is hit-or-miss.
* `STACKOVERFLOW_KEY` can be obtained by [registering your app at stackapps](https://stackapps.com/apps/oauth/register).
* `TENOR_KEY` can be obtained by [Registering an Application at the Tenor website](https://tenor.com/developer/keyregistration).
* `THECATAPI_KEY` can be obtained at the [TheCatAPI website](https://thecatapi.com/).
* `TMDB_KEY` can be obtained by [following these instructions at the TMDB website](https://www.themoviedb.org/documentation/api). Read the "How do I apply for an API key?" section.
* `TUMBLR_KEY` can be obtained at the [Tumblr developer portal](https://www.tumblr.com/oauth/apps).
* `TWITTER_KEY` and `TWITTER_SECRET` can be obtained at the [Twitter developer portal](https://developer.twitter.com/en/apps).
* `UNSPLASH_KEY` can be obtained at the [Unsplash developer portal](https://unsplash.com/developers).
* `USPS_USERID` can be obtained at the [Web Tools API Portal](https://www.usps.com/business/web-tools-apis/).
* `WATTPAD_KEY` can be obtained at the [Wattpad developer portal](https://www.wattpad.com/developer/docs/api).
* `WEBSTER_KEY` can be obtained by [going to the Dictionary API website](https://dictionaryapi.com/). Find the "GET STARTED USING OUR API" section.
* `XIAO_GITHUB_REPO_NAME` and `XIAO_GITHUB_REPO_USERNAME` are just the username and name of Xiao's repo on GitHub. For example, `dragonfire535` for the username and `xiao` for the name.

### Imgur Album IDs

This section is a bit different, as all of these keys are the same
process. First, [sign up for Imgur](https://imgur.com/). Then, just
go to your profile and make albums that contain the images for the
command you want to use. Use the ID of that album (look at the URL)
as the variable. Yes, you need to fill these albums yourself. This is
why you shouldn't self-host Xiao.

## Related Bots

* [Rando Cardrissian](https://github.com/dragonfire535/rando-cardrissian) is a Cards Against Humanity bot, whose features were originally built into Xiao.

## Options

Options in Xiao are configured using channel topics. Place the option
in the appropriate channel's topic to use it.

### General Options
* `<xiao:disable-leave>` Disables leave messages (System Channel).

### Phone Options
* `<xiao:phone>` Allows this channel to recieve phone calls.
* `<xiao:phone:auto-accept>` Automatically accepts all incoming phone calls.
* `<xiao:phone:no-notice>` Hides the abuse notice from phone call pick-ups.
* `<xiao:phone:no-voicemail>` Prevents this channel from recieving voicemails for missed calls.
* `<xiao:phone:no-random>` Makes the channel only able to be called directly, rather than picked randomly.
* `<xiao:phone:block:INSERTIDHERE>` Blocks a channel or server from contacting you via phone.
* `<xiao:phone-book:hide>` Hides this channel from `phone-book`.

### Portal Options
* `<xiao:portal>` Marks the channel as a portal channel for `portal-send`.
* `<xiao:portal:hide-name>` Hides the channel's name when the channel is chosen to recieve a portal message.

## Commands

Total: 602

### Utility:

* **changelog:** Responds with the bot's latest 10 commits.
* **cloc:** Responds with the bot's code line count.
* **command-leaderboard:** Responds with the bot's most used commands.
* **credit:** Responds with a command's credits list.
* **donate:** Responds with the bot's donation links.
* **group-leaderboard:** Responds with the bot's most used command groups.
* **help:** Displays a list of available commands, or detailed information for a specific command.
* **high-scores:** Responds with the high scores the bot has saved.
* **info:** Responds with detailed bot information.
* **invite:** Responds with the bot's invite links.
* **last-run-leaderboard:** Responds with the bot's most recently run commands.
* **last-run:** Responds with a command's most recent run date.
* **options:** Responds with a list of server options.
* **ping:** Checks the bot's ping to the Discord server.
* **prefix:** Responds with the bot's command prefix.
* **report:** Reports something to the bot owner(s).
* **uses:** Responds with a command's usage stats.

### Utility (Voice):

* **join:** Joins your voice channel.
* **leave:** Leaves the current voice channel.
* **pause:** Pauses the current audio playing.
* **resume:** Resume the current audio playing.
* **stop:** Stops the current audio playing.

### Utility (Owner):

* **eval:** Executes JavaScript code. (Owner-Only)
* **command-last-run-export:** Exports a command last run JSON file. (Owner-Only)
* **command-last-run-import:** Imports a command last run JSON file. (Owner-Only)
* **command-leaderboard-export:** Exports a command leaderboard JSON file. (Owner-Only)
* **command-leaderboard-import:** Imports a command leaderboard JSON file. (Owner-Only)
* **dependency-update:** Checks for dependency updates. (Owner-Only)
* **exec:** Executes a command-line application. (Owner-Only)
* **generate-commands:** Generates the commands list for Xiao's README. (Owner-Only)
* **generate-credit:** Generates the credit list for Xiao's README. (Owner-Only)
* **generate-fun-information:** Generates the "Fun Information" for Xiao's README. (Owner-Only)
* **generate-process-env:** Generates a backup list of Xiao's `process.env`. (Owner-Only)
* **ip:** Responds with the IP address the bot's server is running on. (Owner-Only)
* **reload:** Reloads a command. (Owner-Only)
* **report-respond:** Responds to a submitted report. (Owner-Only)
* **set-uses:** Changes command usage stats. (Owner-Only)
* **shutdown:** Shuts down the bot. (Owner-Only)
* **webhook:** Posts a message to the webhook defined in the bot owner's `process.env`. (Owner-Only)

### Discord Information:

* **avatar:** Responds with a user's avatar.
* **channel:** Responds with detailed information on a channel.
* **emoji-image:** Responds with an emoji's full-scale image.
* **emoji-list:** Responds with a list of the server's custom emoji.
* **emoji:** Responds with detailed information on an emoji.
* **first-message:** Responds with the first message ever sent to a channel.
* **id:** Responds with a user's ID.
* **message-source:** Responds with a codeblock containing a message's contents.
* **message:** Responds with detailed information on a message.
* **role:** Responds with detailed information on a role.
* **server:** Responds with detailed information on the server.
* **user:** Responds with detailed information on a user.

### Random Response:

* **8-ball:** Asks your question to the Magic 8 Ball.
* **acrostic:** Creates an acrostic from any word or name.
* **advice:** Responds with a random bit of advice.
* **axis-cult:** Responds with a teaching of the Axis Cult.
* **boredom:** Responds with a random activity to try when you're bored.
* **charlie-charlie:** Asks your question to Charlie.
* **choose:** Chooses between options you provide.
* **chuck-norris:** Responds with a random Chuck Norris joke.
* **coin:** Flips a coin.
* **compliment:** Compliments a user.
* **draw-cards:** Draws a random hand of playing cards.
* **fact-core:** Responds with a random Fact Core quote.
* **fact:** Responds with a random fact.
* **fml:** Responds with a FML quote. (NSFW)
* **fortune:** Responds with a random fortune.
* **github-zen:** Responds with a random GitHub design philosophy.
* **joke:** Responds with a random joke.
* **kiss-marry-kill:** Determines who to kiss, who to marry, and who to kill.
* **light-novel-title:** Responds with a randomly generated Light Novel title.
* **lorem-ipsum:** Generates a randomized Lorem Ipsum placeholder text.
* **magic-conch:** Asks your question to the Magic Conch.
* **name:** Responds with a random name, with the gender of your choice.
* **never-have-i-ever:** Responds with a random "Never Have I Ever..." statement.
* **news:** Responds with a random news article.
* **number-fact:** Responds with a random fact about a specific number.
* **offspring:** Determines if your new child will be a boy or a girl.
* **opinion:** Determines the opinion on something.
* **oracle-turret:** Responds with a random Oracle Turret quote.
* **pun:** Responds with a random pun.
* **quantum-coin:** Flips a coin that lands on some form of nothing.
* **quote:** Responds with a random quote.
* **random-user:** Randomly chooses a member of the server.
* **rank:** Ranks the options you provide.
* **rate:** Rates something.
* **roast:** Roasts a user.
* **roll:** Rolls a dice with a minimum/maximum value of your choice.
* **security-key:** Responds with a random security key.
* **shower-thought:** Responds with a random shower thought, directly from r/Showerthoughts.
* **smw-level:** Responds with a random Super Mario World level name.
* **subreddit:** Responds with a random post from a subreddit.
* **suggest-command:** Suggests a random command for you to try.
* **superpower:** Responds with a random superpower.
* **the-onion:** Responds with a random "The Onion" article.
* **this-for-that:** So, basically, it's like a bot command for this dumb meme.
* **word:** Responds with a random word.
* **xiao-fact:** Responds with a random fact about Xiao.
* **yes-no:** Answers a yes/no question randomly.
* **yo-mama:** Responds with a random "Yo Mama" joke.

### Random Image:

* **ai-artwork:** Responds with randomly generated artwork.
* **ai-cat:** Responds with a randomly generated cat.
* **ai-fursona:** Responds with a randomly generated fursona.
* **ai-horse:** Responds with a randomly generated horse.
* **ai-person:** Responds with a randomly generated person.
* **ai-vase:** Responds with a randomly generated vase.
* **ai-waifu:** Responds with a randomly generated waifu.
* **awwnime:** Responds with cute random anime art.
* **bird:** Responds with a random image of a bird.
* **bunny:** Responds with a random bunny image and fact.
* **cat:** Responds with a random cat image and fact.
* **dog:** Responds with a random dog image and fact.
* **duck:** Responds with a random duck image.
* **fidget:** Responds with a random image of Fidget.
* **food:** Responds with a randomly generated food.
* **fox:** Responds with a random fox image.
* **hentai:** Responds with a random hentai image. (NSFW)
* **interesting:** Responds with a random interesting image.
* **light-novel-cover:** Responds with a randomly generated Light Novel cover. (NSFW)
* **lorem-picsum:** Responds with a random image of a certain size.
* **meme:** Responds with a random meme.
* **porn:** Responds with a random porn image. (NSFW)
* **potato:** Responds with a random potato image.
* **shiba:** Responds with a random image of a Shiba Inu.
* **xiao:** Responds with a random image of Xiao Pai.

### Seeded Randomizers:

* **butt:** Determines a user's butt quality.
* **coolness:** Determines a user's coolness.
* **cuteness:** Determines a user's cuteness.
* **dick:** Determines your dick size. (NSFW)
* **friendship:** Determines how good friends two users are.
* **guess-looks:** Guesses what a user looks like.
* **iq:** Determines a user's IQ.
* **name-rater:** Determines a name's quality.
* **psycho-pass:** Determines your Crime Coefficient.
* **ship:** Ships two users together.
* **smash-or-pass:** Determines if a user is worthy of a smash or a pass.
* **thicc:** Determines how thicc you are.
* **worth:** Determines how much a user is worth.

### Single Response:

* **can-you-not:** Can YOU not?
* **cave:** Sends a Minecraft cave that blends in with the chat.
* **dark-light:** Determines whether you use dark or light theme.
* **eat-pant:** Eat pant.
* **eggs-get-laid:** Sends the ultimate roast.
* **fly:** Sends a fake fly that looks surprisngly real.
* **give-flower:** Gives Xiao Pai a flower.
* **hi:** Hello.
* **idiot:** Responds with the Wikipedia page of an idiot.
* **just-do-it:** Sends a link to the "Just Do It!" motivational speech.
* **lenny:** Responds with the lenny face.
* **rickroll:** Sends a link to the "Never Gonna Give You Up" music video.
* **spam:** Responds with a picture of Spam.
* **tableflip:** Flips a table... With animation!
* **where-is-everybody:** Where is everybody?
* **wynaut:** Why not? Wynaut?
* **yoff:** Posts a picture that truly defines modern art.

### Automatic Response:

* **no-u:** no u
* **unflip:** Unflips a flipped table.

### Events:

* **anime-airing:** Responds with a list of the anime that air today.
* **apod:** Responds with today's Astronomy Picture of the Day.
* **calendar:** Responds with the calendar for a specific month and year.
* **covid-19:** Responds with stats for COVID-19.
* **days-since:** Responds with how many days there have been since a certain date.
* **days-until:** Responds with how many days there are until a certain date.
* **doomsday-clock:** Responds with the current time of the Doomsday Clock.
* **friday-the-13th:** Determines if today is Friday the 13th.
* **google-doodle:** Responds with a Google Doodle, either the latest one or a random one from the past.
* **holidays:** Responds with today's holidays.
* **horoscope:** Responds with today's horoscope for a specific Zodiac sign.
* **humble-bundle:** Responds with the current Humble Bundle.
* **is-tuesday:** Determines if today is Tuesday.
* **iss:** Responds with where the Internation Space Station currently is.
* **neko-atsume-password:** Responds with today's Neko Atsume password.
* **people-in-space:** Responds with the people currently in space.
* **time:** Responds with the current time in a particular location.
* **today-in-history:** Responds with an event that occurred today in history.
* **us-election:** Responds with the odds of each canidate winning the presidential election, according to 538.
* **year-progress:** Responds with the progress of the current year.

### Search:

* **anilist:** Responds with user information for an Anilist user.
* **anime-character:** Searches AniList for your query, getting character results.
* **anime-staff:** Searches AniList for your query, getting staff results.
* **anime:** Searches AniList for your query, getting anime results.
* **book:** Searches Google Books for a book.
* **bulbapedia:** Searches Bulbapedia for your query.
* **company:** Responds with the name and logo of a company.
* **country:** Responds with information on a country.
* **danbooru:** Responds with an image from Danbooru, with optional query. (NSFW)
* **define:** Defines a word.
* **derpibooru:** Responds with an image from Derpibooru.
* **deviantart:** Responds with an image from a DeviantArt section, with optional query.
* **flickr:** Searches Flickr for your query... Maybe. (NSFW)
* **frinkiac:** Input a line from the Simpsons to get the episode/season.
* **giphy:** Searches Giphy for your query.
* **github:** Responds with information on a GitHub repository.
* **google-autofill:** Responds with a list of the Google Autofill results for a particular query.
* **google:** Searches Google for your query.
* **gravatar:** Responds with the Gravatar for an email.
* **http-cat:** Responds with a cat for an HTTP status code.
* **http-dog:** Responds with a dog for an HTTP status code.
* **http-duck:** Responds with a duck for an HTTP status code.
* **imgur:** Searches Imgur for your query.
* **itunes:** Searches iTunes for your query.
* **jisho:** Defines a word, but with Japanese.
* **kickstarter:** Searches Kickstarter for your query.
* **know-your-meme:** Searches Know Your Meme for your query.
* **league-of-legends:** Responds with information on a League of Legends champion.
* **lyrics:** Responds with lyrics to a song.
* **mal-badges:** Responds with a MyAnimeList user's mal-badges badge.
* **manga:** Searches AniList for your query, getting manga results.
* **map:** Responds with a map of a specific location.
* **mayo-clinic:** Searches Mayo Clinic for your query.
* **mdn:** Searches MDN for your query.
* **movie:** Searches TMDB for your query, getting movie results.
* **nasa:** Searches NASA's image archive for your query.
* **neopet:** Responds with the image of a specific Neopet.
* **neopets-item:** Responds with information on a specific Neopets item.
* **npm:** Responds with information on an NPM package.
* **osu:** Responds with information on an osu! user.
* **paladins:** Responds with information on a Paladins player.
* **periodic-table:** Finds an element on the periodic table.
* **poem:** Searches for poems by a specific author.
* **pornhub:** Searches Pornhub for your query. (NSFW)
* **recipe:** Searches for recipes based on your query.
* **reddit:** Responds with information on a Reddit user.
* **right-stuf:** Searches Right Stuf Anime for your query.
* **rotten-tomatoes:** Searches Rotten Tomatoes for your query.
* **rule:** Responds with a rule of the internet.
* **safebooru:** Responds with an image from Safebooru, with optional query.
* **stack-overflow:** Searches Stack Overflow for your query.
* **steam:** Searches Steam for your query.
* **stock-photo:** Searches for stock photos based on your query.
* **stocks:** Responds with the current stocks for a company.
* **tenor:** Searches Tenor for your query.
* **tumblr:** Responds with information on a Tumblr blog.
* **tv-show:** Searches TMDB for your query, getting TV show results.
* **twitter:** Responds with information on a Twitter user.
* **urban:** Defines a word, but with Urban Dictionary.
* **usps-tracking:** Gets tracking information for a package shipped via USPS.
* **vocadb:** Searches VocaDB for your query.
* **wattpad:** Searches Wattpad for your query.
* **weather:** Responds with weather information for a specific location.
* **wikia:** Searches a specific Wikia wiki for your query.
* **wikihow:** Searches Wikihow for your query.
* **wikipedia:** Searches Wikipedia for your query.
* **xkcd:** Responds with an XKCD comic, either today's, a random one, or a specific one.
* **youtube:** Searches YouTube for your query.
* **yu-gi-oh:** Responds with info on a Yu-Gi-Oh! card.

### Pokédex:

* **pokedex-ability:** Searches the Pokédex for a Pokémon ability.
* **pokedex-cry:** Plays a Pokémon's cry.
* **pokedex-image:** Responds with the image of a Pokémon.
* **pokedex-item:** Searches the Pokédex for a Pokémon item.
* **pokedex-location:** Responds with the location data for a Pokémon.
* **pokedex-move:** Searches the Pokédex for a Pokémon move.
* **pokedex-moveset:** Responds with the moveset for a Pokémon.
* **pokedex-stats:** Responds with the stats for a Pokémon.
* **pokedex:** Searches the Pokédex for a Pokémon.
* **smogon:** Responds with the Smogon tiers for a Pokémon.

### Analyzers:

* **age:** Responds with how old someone born in a certain year is.
* **birthstone:** Responds with the Birthstone for a month.
* **character-count:** Responds with the character count of text.
* **chinese-zodiac:** Responds with the Chinese Zodiac Sign for the given year.
* **dominant-color:** Determines the dominant color of an image.
* **face:** Determines the race, gender, and age of a face.
* **gender:** Determines the gender of a name.
* **has-transparency:** Determines if an image has transparency in it.
* **image-size:** Determines the size of an image.
* **ocr:** Performs Optical Character Recognition on an image.
* **parse-time:** Analyzes the time duration you provide and gives the result.
* **read-qr-code:** Reads a QR Code.
* **safe-url:** Determines if a URL is safe or not.
* **scrabble-score:** Responds with the scrabble score of a word.
* **severe-toxicity:** Determines the toxicity of text, but less sensitive to milder language.
* **toxicity:** Determines the toxicity of text.
* **valid-url:** Tests whether a URL is valid or not.
* **what-anime:** Determines what anime a screenshot is from.
* **zodiac-sign:** Responds with the Zodiac Sign for the given month/day.

### Single-Player Games:

* **akinator:** Think about a real or fictional character, I will try to guess who it is.
* **anagramica:** Try to find all the anagrams for a given set of letters.
* **antidepressant-or-tolkien:** See if you can guess if a word is an Antidepressant or Tolkien character.
* **blackjack:** Play a game of blackjack.
* **box-choosing:** Do you believe that there are choices in life? Taken from Higurashi Chapter 4.
* **bubble-wrap:** Pop some bubble wrap.
* **captcha:** Try to guess what the captcha says.
* **chance:** Attempt to win with a 1 in 1000 (or your choice) chance of winning.
* **doors:** Open the right door, and you win the money! Make the wrong choice, and you get the fire!
* **fishy:** Go fishing.
* **google-feud:** Attempt to determine the top suggestions for a Google search.
* **hangman:** Prevent a man from being hanged by guessing a word as fast as you can.
* **hearing-test:** Test your hearing.
* **horse-info:** Responds with detailed information on a horse.
* **horse-race:** Bet on the fastest horse in a 6-horse race.
* **hunger-games:** Simulate a Hunger Games match with up to 24 tributes.
* **ib-hardcore-edition:** Responds with the download link for Ib: Hardcore Edition.
* **jeopardy:** Answer a Jeopardy question.
* **lottery:** Attempt to win the lottery with 6 numbers.
* **mad-libs:** Choose words that fill in the blanks to create a crazy story!
* **math-quiz:** See how fast you can answer a math problem in a given time limit.
* **memory:** Test your memory.
* **minesweeper:** Play a game of Minesweeper.
* **pokemon-advantage:** Guess which Pokémon has the type advantage.
* **quiz:** Answer a quiz question.
* **reaction-time:** Test your reaction time.
* **rock-paper-scissors:** Play Rock-Paper-Scissors.
* **roulette:** Play a game of roulette.
* **slots:** Play a game of slots.
* **sorting-hat:** Take a quiz to determine your Hogwarts house.
* **the-game:** If you think about the game, you lose.
* **true-or-false:** Answer a true or false question.
* **typing-test:** See how fast you can type a sentence.
* **waldo:** Try to find Waldo with spoiler tags!
* **whos-that-pokemon-cry:** Guess who that Pokémon is, based on their cry.
* **whos-that-pokemon:** Guess who that Pokémon is, based on their silhouette.
* **will-you-press-the-button:** Responds with a random "Will You Press The Button?" dilemma.
* **would-you-rather:** Responds with a random "Would you rather ...?" question.

### Multi-Player Games:

* **balloon-pop:** Don't let yourself be the last one to pump the balloon before it pops!
* **battle:** Engage in a turn-based battle against another user or the AI.
* **bingo:** Play bingo with up to 99 other users.
* **car-race:** Race a car against another user or the AI.
* **chess-delete:** Deletes your saved Chess game.
* **chess:** Play a game of Chess with another user or the AI.
* **connect-four:** Play a game of Connect Four with another user or the AI.
* **cram:** Play a game of Cram with another user.
* **domineering:** Play a game of Domineering with another user.
* **dots-and-boxes:** Play a game of Dots and Boxes with another user.
* **emoji-emoji-revolution:** Can you type arrow emoji faster than anyone else has ever typed them before?
* **guesspionage:** Tests your knowledge of humans as you guess how people responded to poll questions.
* **gunfight:** Engage in a western gunfight against another user. High noon.
* **imposter:** Who is the imposter among us?
* **island:** Who will be the final two left on the island after a series of vote-kicks?
* **jenga:** Play a game of Jenga with another user or the AI.
* **lie-swatter:** Players are given a fact and must quickly decide if it's True or a Lie.
* **nim:** Play a game of nim with another user or the AI.
* **obstruction:** Play a game of Obstruction with another user.
* **pick-a-number:** Two players pick a number between 1 and 10. Whoever's closer wins.
* **poker:** Play poker with up to 5 other users.
* **quiz-duel:** Answer a series of quiz questions against other opponents.
* **russian-roulette:** Who will pull the trigger and die first?
* **spam-war:** See who can type more characters the fastest.
* **tic-tac-toe:** Play a game of tic-tac-toe with another user or the AI.
* **typing-race:** Race a user to see who can type a sentence faster.
* **word-chain:** Try to come up with words that start with the last letter of your opponent's word.
* **word-spud:** Hot potato, but with words.

### Image Manipulation:

* **ace-attorney:** Sends a text box from Ace Attorney with the quote and character of your choice.
* **achievement:** Sends a Minecraft achievement with the text of your choice.
* **adorable:** Creates an adorable avatar based on the text you provide.
* **apple-engraving:** Engraves the text of your choice onto an Apple product.
* **approved:** Draws an "approved" stamp over an image or a user's avatar.
* **axis-cult-sign-up:** Sends an Axis Cult Sign-Up sheet for you. Join today!
* **blur:** Draws an image or a user's avatar but blurred.
* **bob-ross:** Draws an image or a user's avatar over Bob Ross' canvas.
* **brazzers:** Draws an image with the Brazzers logo in the corner. (NSFW)
* **caution:** Creates a caution sign with the text of your choice.
* **certificate:** Sends a certificate of excellence with the name and reason of your choice.
* **charcoal:** Draws an image or a user's avatar but with charcoal.
* **chinese-restaurant:** Sends a Chinese restaurant sign with the text of your choice.
* **circle:** Draws an image or a user's avatar as a circle.
* **color:** Sends an image of the color you choose.
* **communist:** Draws the Communist flag over an image or a user's avatar.
* **contrast:** Draws an image or a user's avatar but with contrast.
* **convert-image:** Converts an image from one format to another.
* **create-qr-code:** Converts text to a QR Code.
* **danger:** Creates a danger sign with the text of your choice.
* **desaturate:** Draws an image or a user's avatar but desaturated.
* **dexter:** Draws an image or a user's avatar over the screen of Dexter from Pokémon.
* **dicebear:** Creates a DiceBear avatar based on the text you provide.
* **distort:** Draws an image or a user's avatar but distorted.
* **emboss:** Draws an image or a user's avatar but embossed.
* **fire-frame:** Draws a fiery border over an image or a user's avatar.
* **fish-eye:** Draws an image or a user's avatar but with a fish-eye lens.
* **frame:** Draws a frame around an image or a user's avatar.
* **gandhi-quote:** Makes Mahatma Gandhi say the quote you want.
* **ghost:** Draws an image or a user's avatar but with a ghost-like transparency.
* **glass-shatter:** Draws an image or a user's avatar with a glass shatter in front of it.
* **glitch:** Draws an image or a user's avatar but glitched.
* **greyscale:** Draws an image or a user's avatar in greyscale.
* **gun:** Draws a gun over an image or a user's avatar.
* **hands:** Draws creepy hands over an image or a user's avatar.
* **highway-sign:** Sends a highway sign sign with the text of your choice.
* **hollywood-star:** Sends a Hollywood Walk of Fame star with the name of your choice.
* **ifunny:** Draws an image with the iFunny logo.
* **implode:** Draws an image or a user's avatar but imploded.
* **invert:** Draws an image or a user's avatar but inverted.
* **jeopardy-question:** Sends a Jeopardy Question with the text of your choice.
* **lego-icon:** Edits an image or avatar onto a character icon from LEGO Star Wars.
* **license-plate:** Creates a license plate with the text of your choice.
* **liquid-rescale:** Draws an image or a user's avatar but with liquid rescale from ImageMagick.
* **minecraft-skin:** Sends the Minecraft skin for a user.
* **mirror:** Draws an image or a user's avatar but mirrored on the X/Y axis (or both).
* **motion-blur:** Draws an image or a user's avatar with motion blur.
* **needs-more-jpeg:** Draws an image or a user's avatar as a low quality JPEG.
* **newspaper:** Creates a fake newspaper with the headline and body of your choice.
* **noise:** Draws an image or a user's avatar but with noise.
* **oil-painting:** Draws an image or a user's avatar but with oil paints.
* **pet:** Pets an image or a user's avatar.
* **pixelize:** Draws an image or a user's avatar pixelized.
* **pokemon-fusion:** Fuses two Generation I Pokémon together.
* **police-tape:** Draws police tape over an image or a user's avatar.
* **rainbow:** Draws a rainbow over an image or a user's avatar.
* **rejected:** Draws a "rejected" stamp over an image or a user's avatar.
* **resize:** Draws an image or a user's avatar resized to the size you want.
* **robohash:** Creates a robot based on the text you provide.
* **rotate:** Draws an image or a user's avatar but rotated a number of degrees.
* **sepia:** Draws an image or a user's avatar in sepia.
* **shields-io-badge:** Creates a badge from shields.io.
* **silhouette:** Draws a silhouette of an image or a user's avatar.
* **simp:** Draws a "simp" stamp over an image or a user's avatar.
* **sketch:** Draws an image or a user's avatar but sketched.
* **snapcode:** Responds with the Snapcode of a Snapchat user.
* **speed-limit:** Sends a Speed Limit sign with the limit of your choice.
* **spongebob-time-card:** Sends a Spongebob Time Card with the text of your choice.
* **spotify-now-playing:** Draws an image or a user's avatar on a Spotify album with the name and artist of your choice.
* **square:** Draws an image or a user's avatar as a square.
* **squish:** Draws an image or a user's avatar but squished across the X or Y axis.
* **steam-card:** Draws an image or a user's avatar on a Steam Trading Card.
* **subtitle:** Adds subtitles to an image.
* **swirl:** Draws an image or a user's avatar but swirled.
* **tint:** Draws an image or a user's avatar but tinted a specific color.
* **trainer-card:** Creates a trainer card for a Pokémon trainer.
* **tweet:** Sends a Twitter tweet with the user and text of your choice.
* **undertale:** Sends a text box from Undertale with the quote and character of your choice.
* **wanted:** Draws an image or a user's avatar over a wanted poster.
* **wild-pokemon:** Draws an image or a user's avatar over a wild Pokémon appearance.
* **you-died:** Sends a "You Died" screen over an image or a user's avatar.
* **yu-gi-oh-gen:** Draws an image or a user's avatar on a Yu-Gi-Oh! Trading Card with the text of your choice.
* **zero-dialogue:** Sends a text box from Megaman Zero with the quote of your choice.

### Avatar Manipulation:

* **avatar-fusion:** Draws a a user's avatar over a user's avatar.
* **chocolate-milk:** Draws a user's avatar holding chocolate milk.
* **eject:** Ejects a user.
* **fire:** Burns a user's avatar.
* **hat:** Draws a hat over a user's avatar.
* **he-lives-in-you:** Draws a user's avatar over Simba from The Lion King's reflection.
* **hearts:** Draws hearts around a user's avatar.
* **i-have-the-power:** Draws a user's avatar over He-Man's face.
* **rip:** Draws a user's avatar over a gravestone.
* **sip:** Draws a user's avatar sipping tea.
* **status-button:** Creates a Discord status button from c99.nl.
* **steam-now-playing-classic:** Draws a user's avatar over a Steam "now playing" notification (old skin).
* **steam-now-playing:** Draws a user's avatar over a Steam "now playing" notification.
* **triggered:** Draws a user's avatar over the "Triggered" meme.

### Meme Generators:

* **3000-years:** Draws an image or a user's avatar over Pokémon's "It's been 3000 years" meme.
* **alert:** Sends a Presidential Alert message with the text of your choice.
* **bart-chalkboard:** Sends a "Bart Chalkboard" meme with the text of your choice.
* **be-like-bill:** Sends a "Be Like Bill" meme with the name of your choice.
* **beautiful:** Draws a user's avatar over Gravity Falls' "Oh, this? This is beautiful." meme.
* **boardroom-meeting:** Sends a "Boardroom Meeting" meme with the text of your choice.
* **catch:** Catch users, revealing who is something.
* **challenger:** Draws an image or a user's avatar over Smash Bros.'s "Challenger Approaching" screen.
* **change-my-mind:** Sends a "Change My Mind" meme with the text of your choice.
* **chi-idea:** Sends a "Daddy, I've got an idea!" Takagi-san meme with the text of your choice.
* **crush:** Draws an image or a user's avatar as Wolverine's crush.
* **cursed-sponge:** Sends a cursed sponge duplicated however many times you want.
* **dear-liberals:** Sends a "Dear Liberals" meme with words of your choice.
* **deep-fry:** Draws an image or a user's avatar but deep-fried.
* **demotivational:** Draws an image or a user's avatar and the text you specify as a demotivational poster.
* **dislike:** Sends an "Everyone Disliked That" meme with the image of your choice.
* **distracted-boyfriend:** Draws three user's avatars over the "Distracted Boyfriend" meme.
* **drakeposting:** Sends a "Drakeposting" meme with the text of your choice.
* **edd-facts-book:** Sends a "Double D's Facts Book" meme with the fact of your choice.
* **enslaved:** Sends a "Ah yes, enslaved" meme with the image and text of your choice.
* **food-broke:** Draws a user's avatar over the "Food Broke" meme.
* **for-five-hours:** Sends an "I've looked at this for 5 hours now" meme with the image of your choice.
* **genie-rules:** Sends a "There are 4 rules" meme with the text of your choice.
* **girl-worth-fighting-for:** Draws an image or a user's avatar as the object of Ling's affection.
* **gru-plan:** Sends a Gru's Plan meme with steps of your choice.
* **i-fear-no-man:** Sends a "I fear no man" meme with the text of your choice.
* **if-those-kids-could-read:** Sends a "If those kids could read, they'd be very upset" meme with the text of your choice.
* **kyon-gun:** Draws an image or a user's avatar behind Kyon shooting a gun.
* **like:** Sends an "Everyone Liked That" meme with the image of your choice.
* **lisa-presentation:** Sends a "Lisa Presentation" meme with the presentation of your choice.
* **look-at-this-photograph:** Draws an image or a user's avatar over Nickelback's photograph.
* **look-what-karen-have:** Draws an image or a user's avatar over Karen's piece of paper.
* **mario-bros-views:** Sends a "Mario Bros. Views" meme with the text of your choice.
* **meme-gen-classic:** Sends a meme with the text and background of your choice.
* **meme-gen-modern:** Sends a meme with the text and image of your choice.
* **metamorphosis:** Sends a "My Metamorphosis Begins" meme with the image and text of your choice.
* **my-collection-grows:** Sends a "My collection grows richer" Nekopara meme with the text of your choice.
* **new-password:** Sends a "Weak Password/Strong Password" meme with the passwords of your choice.
* **nike-ad:** Sends a "Believe in Something" Nike Ad meme with the text of your choice.
* **panik-kalm-panik:** Sends a "Panik, Kalm, Panik" meme with the text of your choice.
* **phoebe-teaching-joey:** Sends a "Phoebe Teaching Joey" meme with text of your choice.
* **pills:** Sends a "Hard to Swallow Pills" meme with the text of your choice.
* **plankton-plan:** Sends a Plankton's Plan meme with steps of your choice.
* **pogchamp:** Sends a pogchamp duplicated however many times you want.
* **scroll-of-truth:** Sends a "Scroll of Truth" meme with the text of your choice.
* **skyrim-skill:** Sends a "Skyrim Skill" meme with the skill and image of your choice.
* **sonic-says:** Sends a "Sonic Says" meme with the quote of your choice.
* **sora-selfie:** Draws an image or a user's avatar behind Sora taking a selfie.
* **sos:** Sends a "Esther Verkest's Help Sign" comic with the text of your choice.
* **spiderman-pointing:** Sends a "Spiderman Pointing at Spiderman" meme with the text of your choice.
* **spongebob-burn:** Sends a "Spongebob Throwing Something into a Fire" meme with words of your choice.
* **that-sign-wont-stop-me:** Sends a "That Sign Won't Stop Me, I Can't read!" meme with the presentation of your choice.
* **this-guy:** Draws an image or a user's avatar over the "Get a load of this guy" meme.
* **thug-life:** Draws "Thug Life" over an image or a user's avatar.
* **to-be-continued:** Draws an image with the "To Be Continued..." arrow.
* **tuxedo-pooh:** Sends a "Tuxedo Winnie the Pooh" meme with the text of your choice.
* **two-buttons:** Sends a "Two Buttons" meme with the buttons of your choice.
* **ultimate-tattoo:** Draws an image or a user's avatar as "The Ultimate Tattoo".
* **vietnam-flashbacks:** Edits Vietnam flashbacks behind an image or a user's avatar.
* **worse-than-hitler:** Draws a user's avatar over Family Guy's "Worse Than Hitler" meme.
* **worthless:** Draws an image or a user's avatar over Gravity Falls' "This is worthless." meme.

### Text Manipulation:

* **base64:** Converts text to/from Base64.
* **binary:** Converts text to binary.
* **braille:** Converts text to braille.
* **brony-speak:** Converts text to brony speak.
* **clap:** Sends 👏 text 👏 like 👏 this.
* **cow-say:** Makes a cow say your text.
* **cursive:** Converts text to cursive.
* **dvorak:** Converts text to Dvorak encoding.
* **embed:** Sends text in an embed.
* **emojify:** Converts text to emoji form.
* **fancy:** Converts text to fancy letters.
* **hex:** Converts text to hex.
* **latlmes:** Creates a Latlmes fake link that redirects to a rickroll.
* **leet:** Converts text to l33t speak.
* **lmgtfy:** Creates a LMGTFY link with the query you provide.
* **lolcat:** Converts text to lolcat.
* **lowercase:** Converts text to lowercase.
* **md5:** Creates a hash of text with the MD5 algorithm.
* **mocking:** SenDs TexT lIkE ThiS.
* **morse:** Converts text to morse code.
* **nobody-name:** Converts a name into the Organization XIII style.
* **owo:** OwO.
* **pig-latin:** Converts text to pig latin.
* **pirate:** Converts text to pirate.
* **repeat:** Repeat text over and over and over and over (etc).
* **reverse:** Reverses text.
* **romaji:** Converts Japanese text to Romaji.
* **say:** Make me say what you want, master.
* **sha-1:** Creates a hash of text with the SHA-1 algorithm.
* **sha-256:** Creates a hash of text with the SHA-256 algorithm.
* **ship-name:** Creates a ship name from two names.
* **shorten-url:** Shortens a URL using bit.ly.
* **shuffle:** Shuffles text.
* **snake-speak:** Convertsssss text to sssssnake ssssspeak.
* **spoiler-letter:** Sends text with each and every character as an individual spoiler.
* **superscript:** Converts text to tiny text.
* **tebahpla:** Reverses the alphabet of text.
* **temmie:** Converts text to Temmie speak.
* **translate:** Translates text to a specific language.
* **txt:** Generates a TXT file from the text you provide.
* **unspoiler:** Removes all spoilers from a message.
* **uppercase:** Converts text to uppercase.
* **upside-down:** Flips text upside-down.
* **url-decode:** Decodes URL characters to regular characters.
* **url-encode:** Encodes text to URL-friendly characters.
* **yoda:** Converts text to Yoda speak.
* **zalgo:** Converts text to zalgo.

### Number Manipulation:

* **currency:** Converts currency from one currency to another.
* **final-grade:** Determines the grade you need to make on your final to get your desired course grade.
* **grade:** Determines your grade on an assignment on an 100-point scale.
* **gravity:** Determines weight on another celestial object.
* **math:** Evaluates a math expression.
* **prime:** Determines if a number is a prime number.
* **roman:** Converts a number to roman numerals.
* **scientific-notation:** Converts a number to scientific notation.
* **tax:** Determines the total cost of something plus tax.
* **units:** Converts units to/from other units.

### Play Audio:

* **airhorn:** Plays an airhorn sound in a voice channel.
* **dec-talk:** The world's best Text-to-Speech.
* **soundboard:** Plays a sound in a voice channel.
* **vocodes:** Speak text like a variety of famous figures.

### Music:

* **play:** Plays a YouTube video in your voice channel.

### Reminders:

* **delete-reminder:** Deletes your reminder.
* **remind:** Sets a reminder.

### Phone:

* **admin-phone:** Starts an admin phone call with a server. (Owner-Only)
* **hang-up:** Hangs up the current phone call.
* **phone-block:** Gives instructions for blocking a channel or server.
* **phone-book:** Looks up phone-enabled servers.
* **phone-info:** Gives information on the current phone call.
* **phone:** Starts a phone call with a random server.

### Coding Tools:

* **beautify:** Beautifies code with js-beautify.
* **lint-rule:** Responds with information on an ESLint rule.
* **lint:** Lints code using ESLint.

### Other:

* **cleverbot:** Talk to Cleverbot. (Owner-Only)
* **dating:** Find the person of your dreams with this dating system!
* **portal-send:** Send a message to a portal channel.
* **prune:** Deletes up to 99 messages from the current channel.
* **rename-all:** Renames every member of the server. (Owner-Only)
* **screenshot:** Takes a screenshot of any webpage.
* **smilebasic:** Responds with a ZIP file for a SmileBASIC project.
* **strawpoll:** Generates a Strawpoll with the options you provide.

### Roleplay:

* **bite:** Bites a user.
* **blush:** Blushes at a user.
* **bro-hoof:** Gives a user a bro hoof.
* **celebrate:** Celebrates.
* **eat:** Feeds a user.
* **explode:** Explodes a user.
* **fist-bump:** Fist-bumps a user.
* **high-five:** High Fives a user.
* **hold-hands:** Holds hands with a user.
* **hug:** Hugs a user.
* **inhale:** Inhales a user.
* **kill:** Kills a user.
* **kiss:** Kisses a user.
* **pat:** Pats a user.
* **poke:** Pokes a user.
* **punch:** Punches a user.
* **slap:** Slaps a user.
* **sleep:** Puts a user to sleep.
* **smile:** Smiles at a user.
* **wake-up:** Wakes up a user.
* **wave:** Waves at a user.
* **wink:** Winks at a user.

## Other Features

Some Xiao features aren't technically commands, but are part of Xiao
nonetheless.

- Leave messages are automatically sent to any channel that recieves welcome messages. These can be turned off with [an option](#options).
- Some commands will automatically run when a certain phrase is said in any message, regardless of if the command itself was called or not. These are:
	* Saying "no u" runs `no-u`.
	* Saying "(╯°□°）╯︵ ┻━┻" runs `unflip`.

## Licensing

The bot is licensed under the GPL 3.0 license. See the file `LICENSE` for more
information. If you plan to use any part of this source code in your own bot, I
would be grateful if you would include some form of credit somewhere.

## Credit

Xiao has a _lot_ of commands, and many of those commands use data or APIs from
outside sources. This list is a list of every single site, user, and API used
to make Xiao possible, and the commands they're used in. Thank you to everyone
here.

> Note: This _does not_ indicate support for the source. I might like them, I might detest them.

- [07th Expansion](http://07th-expansion.net/)
	* box-choosing (Original Game)
	* soundboard (Nipah Sound)
- [0vertime-dev](https://github.com/0vertime-dev)
	* hentai (Original Subreddit List)
	* porn (Original Subreddit List)
	* thicc (Concept)
- [1337.me](https://1337.me/)
	* leet (Code)
- [20th Century Fox](https://www.foxmovies.com/)
	* bart-chalkboard ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
	* eat-pant ([Original "The Simpsons" Show](http://www.simpsonsworld.com/))
	* if-those-kids-could-read (Image, Original "King of the Hill" Show)
	* lisa-presentation ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
	* worse-than-hitler ([Image, Original "Family Guy" Show](https://www.fox.com/family-guy/))
- [4Kids](https://www.4kidsentertainmentinc.com/)
	* soundboard (Who's That Pokémon Sound)
	* whos-that-pokemon ("Who's That Pokémon?" Sound)
- [@Candasaurus](https://twitter.com/Candasaurus)
	* sora-selfie ([Image](https://twitter.com/Candasaurus/status/1041946636656599045))
- [@liltusk](https://twitter.com/liltusk)
	* food-broke ([Image](https://twitter.com/liltusk/status/835719948597137408))
- [Adorable Avatars](http://avatars.adorable.io/)
	* adorable (Original API)
- [Advice Slip](https://adviceslip.com/)
	* advice ([API](https://api.adviceslip.com/))
- [Akinator](https://en.akinator.com/)
	* akinator (API)
- [Alexey Star](https://alexeystar.com/)
	* hollywood-star ([Hollywood Star Font](https://alexeystar.com/hollywood-star-font/))
- [Alpha Vantage](https://www.alphavantage.co/)
	* stocks (API)
- [Ambition](https://ambition.com/)
	* horse-race ([Image](https://help.ambition.com/hc/en-us/articles/360005048011-How-do-I-set-up-a-Leaderboard-Slide-))
- [Andrew Tyler](https://www.dafont.com/andrew-tyler.d2526)
	* achievement ([Minecraftia Font](https://www.dafont.com/minecraftia.font))
- [AniList](https://anilist.co/)
	* anilist ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* anime ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* anime-airing ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* anime-character ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* anime-staff ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* manga ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
- [Antidepressants or Tolkien](https://antidepressantsortolkien.now.sh/)
	* antidepressant-or-tolkien (Question Data)
- [Antonio Guillem](http://antonioguillem.com/)
	* distracted-boyfriend ([Image](https://www.istockphoto.com/photo/gm493656728-77018851))
- [Apple](https://www.apple.com/)
	* alert ([San Francisco Font](https://developer.apple.com/fonts/))
	* apple-engraving (API)
	* itunes ([iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/))
	* soundboard (Cat Sound)
- [Ash Pikachu Font](https://www.dafont.com/ashpikachu099.d2541)
	* highway-sign ([Electronic Highway Sign Font](https://www.dafont.com/electronic-highway-sign.font))
	* speed-limit ([Highway Gothic Font](https://www.dafont.com/highway-gothic.font))
- [astrology.TV](https://astrology.tv/)
	* horoscope ([Horoscope Data](https://astrology.tv/horoscope/daily/))
- [ATOM.SMASHER.ORG](http://atom.smasher.org/)
	* chinese-restaurant ([Image](http://atom.smasher.org/chinese/))
	* highway-sign ([Image](http://atom.smasher.org/construction/))
- [Attype Studio](https://www.dafont.com/fadli-ramadhan-iskandar.d7339)
	* friendship ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
	* ship ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
- [Axis Order Bot](https://www.reddit.com/r/axisorderbot/wiki/index)
	* axis-cult (Prayer Data)
- [AZLyrics](https://www.azlyrics.com/)
	* lyrics (Lyrics Data)
- [AzuraApple](https://github.com/AzuraApple)
	* cuteness (Concept)
	* worth (Concept)
- [Back to the Future](https://www.backtothefuture.com/)
	* car-race (DeLorean Car Original Design)
- [Becel](https://www.becel.ca/en-ca)
	* hat (Becel Hat Image)
- [Bethesda](https://bethesda.net/en/dashboard)
	* dislike ([Image, Original "Fallout" Game](https://fallout.bethesda.net/en/))
	* like ([Image, Original "Fallout" Game](https://fallout.bethesda.net/en/))
	* skyrim-skill ([Image, Original "The Elder Scrolls V: Skyrim" Game](https://elderscrolls.bethesda.net/en/skyrim))
- [Bitly](https://bitly.com/)
	* shorten-url ([API](https://dev.bitly.com/v4_documentation.html))
- [Block List Project](https://blocklist.site/)
	* screenshot ([NSFW Site List](https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt))
- [Bob Ross](https://www.bobross.com/)
	* bob-ross (Himself)
- [Bored API](https://www.boredapi.com/)
	* boredom (API)
- [Bowserinator](https://github.com/Bowserinator/)
	* periodic-table ([Periodic Table Data](https://github.com/Bowserinator/Periodic-Table-JSON))
- [BrantSteele](https://brantsteele.com/)
	* hunger-games ([Original "Hunger Games Simulator" Game](http://brantsteele.net/hungergames/reaping.php))
- [Brazzers](https://www.brazzers.com/)
	* brazzers (Logo)
- [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)
	* bulbapedia ([API](https://bulbapedia.bulbagarden.net/w/api.php))
- [Bulletin of the Atomic Scientists](https://thebulletin.org/)
	* doomsday-clock ([Doomsday Clock Data](https://thebulletin.org/doomsday-clock/current-time/))
- [bunnies.io](https://www.bunnies.io/)
	* bunny (API)
- [bushin](https://www.cardmaker.net/profile/220983-bushin/)
	* yu-gi-oh-gen ([Fonts](https://www.cardmaker.net/forums/topic/308603-fonts-for-yu-gi-oh-card-making-with-multilingual-support/))
- [calzoneman](https://github.com/calzoneman)
	* dec-talk ([API](https://github.com/calzoneman/aeiou))
- [Cam Martinez](http://soundbible.com/)
	* soundboard ([Car Crash Sound](http://soundbible.com/1757-Car-Brake-Crash.html))
- [Capcom](http://www.capcom.com/us/)
	* ace-attorney ([Images, Original "Ace Attorney" Game](http://www.ace-attorney.com/))
	* zero-dialogue ([Image, Original "Megaman Zero" Game](http://megaman.capcom.com/))
- [Carter Sande](https://gitlab.com/cartr)
	* undertale ([DeterminationMono, UndertaleSans, and UndertalePapyrus Fonts](https://gitlab.com/cartr/undertale-fonts/tree/master))
- [Cartoon Network](https://www.cartoonnetworkme.com/)
	* edd-facts-book ([Image, Original "Ed, Edd n Eddy" TV Series](https://www.cartoonnetworkme.com/show/ed-edd-n-eddy))
- [cheesecakejedi](https://imgur.com/user/cheesecakejedi)
	* axis-cult-sign-up ([Image](https://imgur.com/gallery/quQTD))
- [Cheng Xiao](https://www.instagram.com/chengxiao_0715/)
	* certificate (Signature)
- [Chess.com](https://www.chess.com/)
	* chess (Board Image)
- [Christoph Mueller](https://www.fontsquirrel.com/fonts/list/foundry/christoph-mueller)
	* captcha ([Moms Typewriter Font](https://www.fontsquirrel.com/fonts/MomsTypewriter))
- [Chuck Norris](https://chucknorris.com/)
	* chuck-norris (Himself)
- [Clearbit](https://clearbit.com/)
	* company ([Autocomplete API](https://dashboard.clearbit.com/docs#autocomplete-api))
- [Cleverbot](https://www.cleverbot.com/)
	* cleverbot ([API](https://www.cleverbot.com/api/))
- [Clip Art Mag](http://clipartmag.com/)
	* car-race ([Deora Car Image](http://clipartmag.com/download-clipart-image#55-chevy-drawing-24.jpg))
- [Clipart Library](http://clipart-library.com/)
	* car-race ([Plane Car Image](http://clipart-library.com/clipart/228505.htm))
	* hat ([Leprechaun Hat Image](http://clipart-library.com/clipart/1107361.htm))
	* rejected ([Image](http://clipart-library.com/clipart/Rejected-Stamp-Transparent.htm))
- [ClipArtBest](http://www.clipartbest.com/)
	* car-race ([Kitano Car Image](http://www.clipartbest.com/clipart-KinXey4XT))
- [ClipartsFree](https://www.clipartsfree.net/)
	* hat ([Top Hat Image](https://www.clipartsfree.net/clipart/51355-gray-top-hat-clipart.html))
- [clux](https://github.com/clux)
	* zalgo ([Zalgo Character Data](https://github.com/clux/zalgolize/blob/master/zalgo.js#L3-L21))
- [CoolClips.com](http://search.coolclips.com/)
	* sip ([Image](http://search.coolclips.com/m/vector/hand0007/Hands-holding-mug/))
- [cowsay Online](http://cowsay.morecode.org/)
	* cow-say (API)
- [Creative Certificates](https://www.creativecertificates.com/)
	* certificate ([Image](https://www.creativecertificates.com/award-certificate-templates/))
- [Currituck County](https://co.currituck.nc.us/)
	* car-race ([Fireworks Image](https://co.currituck.nc.us/fireworks/))
- [DaFont](https://www.dafont.com/)
	* pokemon-advantage ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
	* whos-that-pokemon ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
	* whos-that-pokemon-cry ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
- [Dale Earnhardt Jr.](https://www.dalejr.com/)
	* car-race (Earnhardt Car Original Driver)
- [Danbooru](https://danbooru.donmai.us/)
	* danbooru (API)
- [Dance Dance Revolution](https://www.ddrgame.com/)
	* emoji-emoji-revolution (Concept)
- [DashieSparkle](https://www.deviantart.com/dashiesparkle)
	* car-race ([Rainbow Car Image](https://www.deviantart.com/dashiesparkle/art/Vector-475-Rainbow-Dash-58-609921260))
- [Dave Hansen](https://www.fontspace.com/dave-hansen)
	* license-plate ([License Plate Font](https://www.fontspace.com/license-plate-font-f3359))
- [Deathbulge](http://deathbulge.com/comics)
	* ultimate-tattoo ([Image](http://deathbulge.com/comics/114))
- [Demirramon](https://www.demirramon.com/)
	* undertale ([Images](https://www.demirramon.com/en/generators/undertale_text_box_generator))
- [Derpibooru](https://derpibooru.org/)
	* derpibooru ([API](https://www.derpibooru.org/pages/api))
- [DeviantArt](https://www.deviantart.com/)
	* deviantart ([API](https://www.deviantart.com/developers/))
- [devsnek](https://github.com/devsnek)
	* owo (Code)
- [DiceBear Avatars](https://avatars.dicebear.com/)
	* dicebear (API)
- [Digital Equipment Corporation](http://gordonbell.azurewebsites.net/digital/timeline/tmlnhome.htm)
	* dec-talk (Original DECTalk Software)
- [Discord](https://discord.com/)
	* airhorn ([Airhorn Sounds](https://github.com/discord/airhornbot/tree/master/audio))
- [Discord Status Button](https://discord.c99.nl/)
	* status-button (API)
- [disease.sh](https://disease.sh/)
	* covid-19 ([COVID-19 API](https://disease.sh/docs/#/))
- [Disney](https://www.disney.com/)
	* beautiful ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
	* car-race (McQueen/Herbie Cars Original Designs)
	* girl-worth-fighting-for ([Original "Mulan" Movie](https://movies.disney.com/mulan))
	* he-lives-in-you ([Image, Original "The Lion King" Movie](https://movies.disney.com/the-lion-king))
	* tuxedo-pooh ([Original "Winnie the Pooh" Movie](https://winniethepooh.disney.com/))
	* worthless ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
- [Disneyclips.com](https://www.disneyclips.com/main.html)
	* car-race ([McQueen Car Image](https://www.disneyclips.com/images2/cars2.html))
- [Dog CEO](https://dog.ceo/)
	* dog ([Dog API](https://dog.ceo/dog-api/))
- [Drake](https://drakeofficial.com/)
	* drakeposting ([Original "Hotline Bling" Music Video](https://youtu.be/uxpDa-c-4Mc))
- [DreamWorks](https://www.dreamworks.com/)
	* where-is-everybody ([Images, Original "Shrek" Movie](https://www.dreamworks.com/movies/shrek))
- [Dust: An Elysian Tail](https://www.noogy.com/main.html)
	* fidget (Original Game)
- [DynamicPickaxe](http://dynamicpickaxe.com/)
	* hat ([Pirate Hat Image](http://dynamicpickaxe.com/pirate-hat-clipart.html))
- [EarthBound Central](https://earthboundcentral.com/)
	* undertale ([Apple Kid Font](https://earthboundcentral.com/2009/11/ultimate-earthbound-font-pack/))
- [ebearskittychan](https://twitter.com/ebearskittychan)
	* temmie (English-to-Temmie Dictionary Data)
- [either](http://either.io)
	* would-you-rather (API)
- [Electronic Arts](https://www.ea.com/)
	* car-race ([Kitano Car Original Design](https://www.ea.com/games/burnout))
- [Enkidulga](https://www.dafont.com/profile.php?user=736583)
	* ace-attorney ([Ace Attorney Font](https://www.dafont.com/ace-attorney.font))
- [Esther Verkest](https://www.facebook.com/Esther-Verkest-49667161749/)
	* sos (Image)
- [Evil Mojo Games](https://www.evilmojogames.com/)
	* paladins ([Original "Paladins" Game](https://www.paladins.com/))
- [Face++ Cognitive Services](https://www.faceplusplus.com/)
	* face ([Face Detection API](https://www.faceplusplus.com/face-detection/))
- [FANDOM](https://www.fandom.com/)
	* superpower ([API](https://powerlisting.fandom.com/api.php))
	* wikia ([API](https://www.wikia.com/api/v1/))
- [festivalclaca.cat](https://www.festivalclaca.cat/)
	* hat ([Soviet Hat Image](https://www.festivalclaca.cat/maxvi/mmbwJ/))
- [FiveThirtyEight](https://fivethirtyeight.com/)
	* us-election ([API](https://projects.fivethirtyeight.com/2020-election-forecast/))
- [Flickr](https://www.flickr.com/)
	* flickr ([API](https://www.flickr.com/services/api/))
- [FML](https://www.fmylife.com/)
	* fml (FML Data)
- [Fontsgeek](http://fontsgeek.com/)
	* chinese-restaurant ([Futura Condensed Font](http://fontsgeek.com/fonts/Futura-Condensed-Bold))
	* skyrim-skill ([Futura Condensed Font](http://fontsgeek.com/fonts/Futura-Condensed-Regular))
- [Foreign exchange rates API](https://exchangeratesapi.io/)
	* currency (API)
- [Free SVG](https://freesvg.org/)
	* horse-race ([Image](https://freesvg.org/race-horse))
- [freeiconspng.com](https://www.freeiconspng.com/)
	* hat ([Birthday Hat Image](https://www.freeiconspng.com/img/43917))
- [Frinkiac](https://frinkiac.com/)
	* frinkiac (API)
- [FromSoftware](https://www.fromsoftware.jp/ww/)
	* you-died (Image, Original "Dark Souls" Game)
- [Gallery Yopriceville](https://gallery.yopriceville.com/)
	* hat ([Pilgrim Hat Image](https://gallery.yopriceville.com/Free-Clipart-Pictures/Thanksgiving-PNG/Transparent_Brown_Pilgrim_Hat_PNG_Clipart))
- [gautamkrishnar](https://github.com/gautamkrishnar/)
	* be-like-bill ([Image](https://github.com/gautamkrishnar/Be-Like-Bill))
- [Gawdl3y](https://github.com/Gawdl3y)
	* rename-all (Concept)
- [Genderize.io](https://genderize.io/)
	* gender (API)
- [gfauchart](https://github.com/gfauchart)
	* adorable ([API](https://github.com/adorableio/avatars-api-middleware/issues/108))
- [GIPHY](https://giphy.com/)
	* giphy ([API](https://developers.giphy.com/))
- [GitHub](https://github.com/)
	* changelog ([API](https://developer.github.com/v3/))
	* github ([API](https://developer.github.com/v3/))
	* github-zen ([Zen API](https://developer.github.com/v3/))
- [Go Nintendo](https://gonintendo.com/)
	* hat ([Ash Hat Image](https://gonintendo.com/stories/306292))
- [Goodsmile Racing](https://www.goodsmileracing.com/en/)
	* car-race (Miku Car Original Design)
- [Google](https://www.google.com/)
	* boardroom-meeting ([Noto Font](https://www.google.com/get/noto/))
	* book ([Books API](https://developers.google.com/books/))
	* catch ([Noto Font](https://www.google.com/get/noto/))
	* caution ([Noto Font](https://www.google.com/get/noto/))
	* change-my-mind ([Noto Font](https://www.google.com/get/noto/))
	* danger ([Noto Font](https://www.google.com/get/noto/))
	* dear-liberals ([Oswald Font](https://fonts.google.com/specimen/Oswald))
	* demotivational ([Noto Font](https://www.google.com/get/noto/))
	* drakeposting ([Noto Font](https://www.google.com/get/noto/))
	* edd-facts-book ([Noto Font](https://www.google.com/get/noto/))
	* eject ([Noto Font](https://www.google.com/get/noto/))
	* enslaved ([Noto Font](https://www.google.com/get/noto/))
	* genie-rules ([Noto Font](https://www.google.com/get/noto/))
	* google ([Custom Search API](https://cse.google.com/cse/all))
	* google-autofill (Autofill API)
	* google-doodle ([Google Doodles API](https://www.google.com/doodles))
	* google-feud (Autofill API)
	* gru-plan ([Noto Font](https://www.google.com/get/noto/))
	* holidays ([Calendar API](https://developers.google.com/calendar/))
	* if-those-kids-could-read ([Noto Font](https://www.google.com/get/noto/))
	* lisa-presentation ([Noto Font](https://www.google.com/get/noto/))
	* map ([Maps Static API](https://developers.google.com/maps/documentation/maps-static/intro))
	* mario-bros-views ([Noto Font](https://www.google.com/get/noto/))
	* meme-gen-modern ([Noto Font](https://www.google.com/get/noto/))
	* metamorphosis ([Noto Font](https://www.google.com/get/noto/))
	* new-password ([Noto Font](https://www.google.com/get/noto/))
	* nike-ad ([Noto Font](https://www.google.com/get/noto/))
	* panik-kalm-panik ([Noto Font](https://www.google.com/get/noto/))
	* periodic-table ([Noto Font](https://www.google.com/get/noto/))
	* phoebe-teaching-joey ([Noto Font](https://www.google.com/get/noto/))
	* pills ([Noto Font](https://www.google.com/get/noto/))
	* plankton-plan ([Noto Font](https://www.google.com/get/noto/))
	* play ([YouTube Data API](https://developers.google.com/youtube/v3/))
	* safe-url ([Safe Browsing API](https://developers.google.com/safe-browsing/))
	* scroll-of-truth ([Noto Font](https://www.google.com/get/noto/))
	* sonic-says ([Noto Font](https://www.google.com/get/noto/))
	* spiderman-pointing ([Noto Font](https://www.google.com/get/noto/))
	* spongebob-burn ([Noto Font](https://www.google.com/get/noto/))
	* spotify-now-playing ([Noto Font](https://www.google.com/get/noto/))
	* steam-card ([Noto Font](https://www.google.com/get/noto/))
	* steam-now-playing ([Noto Font](https://www.google.com/get/noto/))
	* steam-now-playing-classic ([Noto Font](https://www.google.com/get/noto/))
	* subtitle ([Noto Font](https://www.google.com/get/noto/))
	* translate ([Google Translate](https://translate.google.com/))
	* tuxedo-pooh ([Noto Font](https://www.google.com/get/noto/))
	* tweet ([Noto Font](https://www.google.com/get/noto/))
	* two-buttons ([Noto Font](https://www.google.com/get/noto/))
	* youtube ([YouTube Data API](https://developers.google.com/youtube/v3/))
- [Google Feud](http://www.googlefeud.com/)
	* google-feud (Original Game)
- [goQR.me](http://goqr.me/)
	* create-qr-code ([QR code API](http://goqr.me/api/))
	* read-qr-code ([QR code API](http://goqr.me/api/))
- [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward)
	* acrostic ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
	* hangman ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
	* word ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
	* word-chain ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
- [Gravatar](https://en.gravatar.com/)
	* gravatar ([API](https://en.gravatar.com/site/implement/))
- [GRSites](http://www.grsites.com/)
	* soundboard ([Laugh Track Sound](http://www.grsites.com/archive/sounds/category/8/))
- [GUST e-foundry](https://www.fontsquirrel.com/fonts/list/foundry/gust-e-foundry)
	* gandhi-quote ([Latin Modern Roman Font](https://www.fontsquirrel.com/fonts/Latin-Modern-Roman))
- [Hackyon](http://www.hackyon.com/playground/fisheye/)
	* fish-eye (Fish-Eye Code)
- [Hanna-Barbera](http://www.webrockonline.com/)
	* car-race (Flintstones Car Original Design)
- [Hasbro](https://shop.hasbro.com/en-us)
	* bro-hoof ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
	* brony-speak ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
	* car-race ([Rainbow Car Original Design](https://mylittlepony.hasbro.com/en-us))
	* connect-four (Original "Connect Four" Game)
	* derpibooru ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
	* scrabble-score ([Original "Scrabble" Game](https://scrabble.hasbro.com/en-us))
- [hbl917070](https://github.com/hbl917070)
	* axis-cult-sign-up ([Font](https://github.com/hbl917070/Konosuba-text))
- [hejibits](https://hejibits.com/)
	* boardroom-meeting ([Image](https://web.archive.org/web/20121226235748/https://hejibits.com/comics/outlook-oust/))
- [Hendrick Motorsports](http://www.hendrickmotorsports.com/)
	* car-race (Earnhardt Car Original Design)
- [Hollywood Walk of Fame](https://walkoffame.com/)
	* hollywood-star (Concept)
- [Horst Faas](https://en.wikipedia.org/wiki/Horst_Faas)
	* vietnam-flashbacks (Image)
- [HTTP Cats](https://http.cat/)
	* http-cat (API)
- [HTTP Status Dogs](https://httpstatusdogs.com/)
	* http-dog (API)
- [Humble Bundle](https://www.humblebundle.com/)
	* humble-bundle ([API](https://www.humblebundle.com/developer))
- [Iconian Fonts](https://www.fontspace.com/iconian-fonts)
	* horse-race ([Paladins Font](https://www.fontspace.com/paladins-font-f32777))
	* rip ([Coffin Stone Font](https://www.fontspace.com/coffin-stone-font-f40998))
- [Iconscout](https://iconscout.com/)
	* car-race ([Runner Car Image](https://iconscout.com/illustrations/marathon-race))
- [iCrawl](https://github.com/iCrawl)
	* butt ([Code, Concept](https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/butts.js))
- [icycatelf](https://www.deviantart.com/icycatelf)
	* yu-gi-oh-gen ([Level/Rank Star Image](https://www.deviantart.com/icycatelf/art/Level-Star-Template-PSD-607344453))
- [iFunny](https://ifunny.co/)
	* ifunny (Logo)
- [Illumination](http://www.illumination.com/)
	* gru-plan ([Original "Despicable Me" Movie](http://www.despicable.me/))
- [ImageMagick](https://imagemagick.org/index.php)
	* charcoal (Image Manipulation)
	* emboss (Image Manipulation)
	* implode (Image Manipulation)
	* liquid-rescale (Image Manipulation)
	* noise (Image Manipulation)
	* oil-painting (Image Manipulation)
	* sketch (Image Manipulation)
	* squish (Image Manipulation)
	* swirl (Image Manipulation)
- [Imgur](https://imgur.com/)
	* bite ([API](https://apidocs.imgur.com/))
	* blush ([API](https://apidocs.imgur.com/))
	* bro-hoof ([API](https://apidocs.imgur.com/))
	* celebrate ([API](https://apidocs.imgur.com/))
	* dating ([API](https://apidocs.imgur.com/))
	* eat ([API](https://apidocs.imgur.com/))
	* explode ([API](https://apidocs.imgur.com/))
	* fidget ([API](https://apidocs.imgur.com/))
	* fist-bump ([API](https://apidocs.imgur.com/))
	* high-five ([API](https://apidocs.imgur.com/))
	* hold-hands ([API](https://apidocs.imgur.com/))
	* hug ([API](https://apidocs.imgur.com/))
	* imgur ([API](https://apidocs.imgur.com/))
	* inhale ([API](https://apidocs.imgur.com/))
	* kill ([API](https://apidocs.imgur.com/))
	* kiss ([API](https://apidocs.imgur.com/))
	* pat ([API](https://apidocs.imgur.com/))
	* poke ([API](https://apidocs.imgur.com/))
	* potato ([API](https://apidocs.imgur.com/))
	* punch ([API](https://apidocs.imgur.com/))
	* slap ([API](https://apidocs.imgur.com/))
	* sleep ([API](https://apidocs.imgur.com/))
	* smile ([API](https://apidocs.imgur.com/))
	* wake-up ([API](https://apidocs.imgur.com/))
	* wave ([API](https://apidocs.imgur.com/))
	* wink ([API](https://apidocs.imgur.com/))
	* xiao ([API](https://apidocs.imgur.com/))
- [Initial D](https://initiald-portal.com/)
	* car-race (AE86 Car Original Design)
- [InnerSloth](https://innersloth.com/index.php)
	* eject ([Original "Among Us" Game](https://innersloth.com/gameAmongUs.php))
- [Inside Scanlation](https://www.insidescanlation.com/)
	* chi-idea ([Wild Words Font](https://www.insidescanlation.com/etc/the-idiots-guide-to-editing-manga/guide/type/fonts.html))
- [ipify API](https://www.ipify.org/)
	* ip (API)
- [iStock](https://www.istockphoto.com/)
	* car-race ([Background Image](https://www.istockphoto.com/vector/side-view-of-a-road-with-a-crash-barrier-roadside-green-meadow-and-clear-blue-sky-gm1081596948-290039955))
- [Jack The Awesomeness Gamer](https://www.youtube.com/channel/UCIeA23B91hAeR1UuC2VDSdQ)
	* challenger ([Image](https://www.youtube.com/watch?v=3FebRrXg0bk))
- [Jackbox Games](https://www.jackboxgames.com/)
	* guesspionage ([Original "Guesspionage" Game](https://www.jackboxgames.com/guesspionage/))
	* lie-swatter ([Original "Lie Swatter" Game](https://www.jackboxgames.com/lie-swatter/))
	* word-spud ([Original "Word Spud" Game](https://www.jackboxgames.com/word-spud/))
- [Jackster Productions](https://www.fontspace.com/jackster-productions)
	* wild-pokemon ([Pokemon GB Font](https://www.fontspace.com/pokemon-gb-font-f9621))
- [Jake Clark](https://jake-clark.tumblr.com/)
	* two-buttons ([Image](https://twitter.com/jakeclarkdude/status/689141113584619524))
- [jasmaa](https://github.com/jasmaa/)
	* neko-atsume-password ([API URL](https://github.com/jasmaa/nekoatsume-password-learner/blob/master/neko_pswd.py#L4))
- [Jeep](https://www.jeep.com/)
	* car-race (Jeep Car Original Design)
- [JellyNeo Item Database](https://items.jellyneo.net/)
	* neopets-item (Item Data)
- [Jenga](https://jenga.com/)
	* jenga (Original Game)
- [Jeopardy](https://www.jeopardy.com/)
	* jeopardy (Music, Original Show)
	* jeopardy-question (Original Show)
	* soundboard (Jeopardy Sound)
- [Jessica Knable](https://picsart.com/u/jessicaknable)
	* hearts ([Image](https://picsart.com/i/sticker-hearts-heart-borders-frames-round-frame-border-love-263412201018212))
- [Jisho](https://jisho.org/)
	* jisho (API)
- [JoJo's Bizzare Adventure](http://www.araki-jojo.com/)
	* dark-light (Original Anime)
	* to-be-continued (Original Anime)
- [Jon Bernhardt](http://web.mit.edu/jonb/www/)
	* bart-chalkboard ([Akbar Font](https://www.wobblymusic.com/groening/akbar.html))
- [jService](http://jservice.io/)
	* jeopardy (API)
- [Kevin Zino](https://codepen.io/natefr0st)
	* car-race ([Mario Car Image](https://codepen.io/natefr0st/pen/GrMrZV))
- [Kickstarter](https://www.kickstarter.com/)
	* kickstarter (API)
- [KINMOZA!](http://www.kinmosa.com/)
	* eggs-get-laid (Original Anime)
	* look-what-karen-have (Original Anime)
- [KissClipart.com](https://www.kissclipart.com/)
	* hat ([Witch Hat Image](https://www.kissclipart.com/halloween-witch-hat-clipart-witch-hat-clip-art-qfycyt/))
- [Know Your Meme](https://knowyourmeme.com/)
	* bob-ross ([Image](https://knowyourmeme.com/photos/1160348))
	* hands ([Image](https://knowyourmeme.com/photos/1583323-screen-reaching-emoji))
	* hat ([Christmas Hat Image](https://knowyourmeme.com/forums/just-for-fun/topics/24821-christmas-hat-thread))
	* know-your-meme (Meme Data)
	* kyon-gun ([Image](https://knowyourmeme.com/photos/217992-endless-eight-kyon-kun-denwa))
	* look-what-karen-have ([Image](https://knowyourmeme.com/photos/1047091-kin-iro-mosaic-kinmoza))
- [Konami](https://www.konami.com/en/)
	* yu-gi-oh ([Original "Yu-Gi-Oh!" Game](https://www.yugioh-card.com/en/))
	* yu-gi-oh-gen ([Images, Original "Yu-Gi-Oh!" Game](https://www.yugioh-card.com/en/))
- [KONOSUBA -God's blessing on this wonderful world!](http://konosuba.com/)
	* axis-cult (Original Anime)
	* axis-cult-sign-up (Original Anime)
	* hat (Megumin Hat Original Anime)
- [KOSTYA_ex_tubli](https://www.gran-turismo.com/us/gtsport/user/profile/6290075/overview)
	* car-race ([Flintstones Car Image](https://www.gran-turismo.com/us/gtsport/user/discover/search/decal/decal/6290075/4684382513076895744))
- [KYB Sport](https://kybsport.com/)
	* car-race ([Miku Car Image](https://kybsport.com/teams/gsr/))
- [La Linea](https://www.lalinea.de/)
	* car-race ([Elise Car Image](https://www.lalinea.de/pkw/neuwagen/lotus/elise/roadster-2-tuerer/2011/))
- [Lake Keowee Chrysler Dodge Jeep Ram](https://www.lakekeoweechryslerdodge.com/)
	* car-race ([Jeep Car Image](https://www.lakekeoweechryslerdodge.com/2017-jeep-wrangler-seneca--sc.htm))
- [Latlmes](https://www.latlmes.com/)
	* latlmes (API)
- [LEGO](https://www.lego.com/en-us)
	* car-race (Lego Car Original Design)
	* lego-icon ([Original Design](https://store.steampowered.com/app/32440/LEGO_Star_Wars__The_Complete_Saga/))
- [LMGTFY](https://lmgtfy.com/)
	* google (API)
	* lmgtfy (API)
- [LN cover generator](https://salty-salty-studios.com/shiz/lncovers.php)
	* light-novel-cover (API)
- [LN title generator](https://salty-salty-studios.com/shiz/ln.php)
	* light-novel-title (API)
- [Lorem Picsum](https://picsum.photos/)
	* lorem-picsum (API)
- [Lotus](https://www.lotuscars.com/en-US/)
	* car-race (Elise Car Original Design)
- [LoveToKnow](https://www.lovetoknow.com/)
	* horse-race ([Horse Name Data](https://horses.lovetoknow.com/horse-names/funny-horse-names))
- [LowGif](http://www.lowgif.com/)
	* fire ([Images](http://www.lowgif.com/43360ebce9150f23.html))
- [Luxoflux](http://www.luxoflux.com/)
	* gun ([Image](https://knowyourmeme.com/memes/hand-pointing-a-gun))
- [Mad Libs](http://www.madlibs.com/)
	* mad-libs (Original Game)
- [Mad:)Takes](https://www.madtakes.com/index.php)
	* mad-libs (Mad Libs Data)
- [mal-badges](http://www.mal-badges.net/)
	* mal-badges (API)
- [MangaGamer.com](https://www.mangagamer.com/)
	* box-choosing ([Original Translation](https://store.steampowered.com/app/526490/Higurashi_When_They_Cry_Hou__Ch4_Himatsubushi/))
- [Marien Bierhuizen](https://www.racedepartment.com/members/marien-bierhuizen.280739/)
	* car-race ([F1 Car Image](https://www.racedepartment.com/downloads/f2018-car-sideviews.22450/updates))
- [Martin Handford](https://www.candlewick.com/authill.asp?b=Author&m=bio&id=1497&pix=y)
	* waldo (Original "Where's Wally?" Book Series)
- [Marvel](https://www.marvel.com/)
	* crush ([Image, Original "X-Men" Comic](https://www.marvel.com/teams-and-groups/x-men))
	* spiderman-pointing ([Image, Original "Spiderman" Comic](https://spiderman.marvelhq.com/))
- [Marvelous](http://www.marv.jp/)
	* give-flower ([Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
	* xiao ([Images, Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
- [mathjs](https://mathjs.org/)
	* units (Expression Parser)
- [Mattel](https://www.mattel.com/en-us)
	* 8-ball ([Original Concept](https://www.mattelgames.com/games/en-us/kids/magic-8-ball))
	* car-race ([Reverb/Deora Cars Original Designs](https://hotwheels.mattel.com/shop))
	* i-have-the-power (Image, Original "He-Man" Show)
- [Max Irwin](http://binarymax.com/)
	* anagramica ([Original "Anagramica" Game, API](http://anagramica.com/))
- [Max Pixel](https://www.maxpixel.net/)
	* car-race ([Stars Image](https://www.maxpixel.net/Stars-Confetti-Curly-String-Balloons-Watercolor-5403247))
- [Mayo Clinic](https://www.mayoclinic.org/)
	* mayo-clinic (Disease Data)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
	* mdn (API)
- [Megadreamer](https://www.deviantart.com/megadreamer)
	* zero-dialogue ([Megaman Zero Dialogue Font](https://www.deviantart.com/megadreamer/art/Megaman-Zero-dialog-font-513708688))
- [Merriam-Webster's Collegiate® Dictionary](https://www.merriam-webster.com/)
	* define ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
	* hangman ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
- [Microsoft](https://www.microsoft.com/en-us)
	* soundboard (Windows Start Up and Windows Error Sounds)
- [Mike Koenig](http://soundbible.com/)
	* soundboard ([Cow Sound](http://soundbible.com/1778-Cow-Moo.html))
	* soundboard ([Rooster Sound](http://soundbible.com/1218-Rooster-Crow.html))
- [mikewesthad](https://github.com/mikewesthad)
	* pirate ([English-to-Pirate Dictionary Data](https://github.com/mikewesthad/pirate-speak/blob/master/lib/pirate-speak.js#L1-L155))
- [Minecraft Achievement Generator](https://www.minecraftskinstealer.com/achievement/)
	* achievement (Image)
- [MinionFan1024](https://www.deviantart.com/minionfan1024)
	* car-race ([Anakin Car Image](https://www.deviantart.com/minionfan1024/art/Anakin-s-podracer-829694073))
- [Missy Meyer](https://missymeyer.com/)
	* that-sign-wont-stop-me ([Tragic Marker Font](https://missymeyer.com/tragic-marker-free-font))
- [Mojang](https://www.mojang.com/)
	* achievement ([Original "Minecraft" Game](https://www.minecraft.net/en-us/))
	* minecraft-skin ([API, Original "Minecraft" Game](https://wiki.vg/Mojang_API))
- [Monotype](https://www.monotype.com/)
	* be-like-bill ([Arial Font](https://catalog.monotype.com/family/monotype/arial))
	* certificate ([Old English Text MT Font](https://catalog.monotype.com/family/monotype/monotype-old-english-text))
- [Monty Hall problem](https://en.wikipedia.org/wiki/Monty_Hall_problem)
	* doors (Concept)
- [MotivaShian](https://www.youtube.com/channel/UC0yDCpC_UaXEdL6Zc4715rg)
	* just-do-it ([Original Motivational Speech](https://www.youtube.com/watch?v=ZXsQAXx_ao0))
- [MotorBiscuit](https://www.motorbiscuit.com/)
	* car-race ([Pickup Car Image](https://www.motorbiscuit.com/1000-hp-nissan-franken-navara-worlds-best-pickup-says-builder/))
- [Mr. Bean](https://www.mrbean.com/)
	* car-race (Bean Car Original Design)
- [muffinlabs - Today in History](http://history.muffinlabs.com/)
	* today-in-history ([API](http://history.muffinlabs.com/#api))
- [MyAnimeList](https://myanimelist.net/)
	* anime (Score Data)
	* manga (Score Data)
- [Mythbusters](https://go.discovery.com/tv-shows/mythbusters)
	* doors (Concept)
- [NASA](https://www.nasa.gov/)
	* apod ([APOD API](https://api.nasa.gov/))
	* dec-talk ([Original "Moonbase Alpha" Game](https://store.steampowered.com/app/39000/Moonbase_Alpha/))
	* gravity ([Planet Gravity Data](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html))
	* nasa ([NASA Image and Video Library API](https://api.nasa.gov/))
- [nauticalspongeinc](https://www.fontspace.com/nauticalspongeinc)
	* spongebob-time-card ([Spongeboytt1 Font](https://www.fontspace.com/spongeboytt1-font-f29761))
- [NBC](https://www.nbc.com/)
	* for-five-hours ([Image, Original "The Office" TV Series](https://www.nbc.com/the-office))
- [Neko Atsume: Kitty Collector](http://nekoatsume.com/en/)
	* neko-atsume-password (API, Original Game)
- [Nekopara](http://nekopara.com/main.html)
	* my-collection-grows ([Image, Original Anime](https://nekopara-anime.com/))
- [Neopets](http://www.neopets.com/)
	* neopet (Pet Image Data, Original Game)
	* neopets-item (Original Game)
	* time (Neopia Time Zone)
- [Nickelback](https://www.nickelback.com/)
	* look-at-this-photograph ([Image, Original "Photograph" Music Video](https://www.youtube.com/watch?v=BB0DU4DoPP4))
- [Nickelodeon](https://www.nick.com/)
	* cursed-sponge ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
	* magic-conch ([Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
	* plankton-plan ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
	* spongebob-burn ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
	* spongebob-time-card ([Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
- [NicolasDavila](https://www.deviantart.com/nicolasdavila)
	* car-race ([Reverb Car Image](https://www.deviantart.com/nicolasdavila/art/Reverb-Wireframe-Blueprint-777342814))
- [Nike](https://www.nike.com/)
	* nike-ad (Logo, Concept)
- [Nintendo](https://www.nintendo.com/)
	* car-race ([Mario Car Original Design](https://mario.nintendo.com/))
	* challenger ([Original "Super Smash Bros." Game](https://www.smashbros.com/en_US/index.html))
	* mario-bros-views ([Original "Super Mario Bros." Game](https://mario.nintendo.com/))
	* smw-level ([Original "Super Mario World" Game](https://www.nintendo.co.jp/n02/shvc/mw/index.html))
- [Noise addicts](http://www.noiseaddicts.com/)
	* hearing-test ([Sounds](http://www.noiseaddicts.com/2011/06/mosquito-ringtones/))
- [NotAWeebDev](https://github.com/NotAWeebDev/)
	* triggered ([Image](https://github.com/NotAWeebDev/Misaki/blob/2e44f9efb467028dcbae5a2c9f836d2e99860b85/assets/images/plate_triggered.png))
- [npm](https://www.npmjs.com/)
	* dependency-update (API)
	* npm (API)
- [Numbers API](http://numbersapi.com/)
	* number-fact (Trivia API)
- [Open Notify](http://open-notify.org/)
	* iss ([ISS Current Location API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/))
	* people-in-space ([People in Space API](http://open-notify.org/Open-Notify-API/People-In-Space/))
- [Open Trivia DB](https://opentdb.com/)
	* lie-swatter ([API](https://opentdb.com/api_config.php))
	* quiz ([API](https://opentdb.com/api_config.php))
	* quiz-duel ([API](https://opentdb.com/api_config.php))
	* true-or-false ([API](https://opentdb.com/api_config.php))
- [OpenWeatherMap](https://openweathermap.org/)
	* weather ([API](https://openweathermap.org/api))
- [OPTIFONT](http://opti.netii.net/)
	* jeopardy ([Korinna Agency Font](https://fontmeme.com/fonts/korinna-agency-font/))
	* jeopardy-question ([Korinna Agency Font](https://fontmeme.com/fonts/korinna-agency-font/))
- [Orange Free Sounds](http://www.orangefreesounds.com/)
	* soundboard ([Dun Dun Dun Sound](http://www.orangefreesounds.com/dun-dun-dun-sound-effect-brass/))
- [osu!](https://osu.ppy.sh/home)
	* osu ([API](https://github.com/ppy/osu-api/wiki))
- [Over the Green Fields](https://asianwiki.com/Over_the_Green_Fields)
	* soundboard (Sad Violin Sound)
- [PAC-MAN Party](http://pacman.com/en/pac-man-games/pac-man-party)
	* balloon-pop (Concept)
- [PaladinsGuru](https://paladins.guru/)
	* paladins (API)
- [PayPal](https://www.paypal.com/us/home)
	* donate (Donation Gathering)
- [PBS Kids](https://pbskids.org/)
	* that-sign-wont-stop-me ([Image, Original "Arthur" Show](https://pbskids.org/arthur/))
- [Perspective API](https://www.perspectiveapi.com/#/)
	* severe-toxicity (API)
	* toxicity (API)
- [PicsArt](https://picsart.com/)
	* car-race ([Bean Car Image](https://picsart.com/i/287426979049211))
- [Pin Clipart](https://www.pinclipart.com/)
	* car-race ([Wheelchair Car Image](https://www.pinclipart.com/maxpin/xToJi/))
	* license-plate ([Image](https://www.pinclipart.com/maxpin/bJxii/))
- [pixabay](https://pixabay.com/)
	* car-race ([Cybertruck Car Image](https://pixabay.com/vectors/tesla-cybertruck-electric-car-4770084/))
- [Pixar Animation Studios](https://www.pixar.com/)
	* car-race ([McQueen Car Original Design](https://www.pixar.com/feature-films/cars))
- [Platinum Designz](http://store.platinumdesignz.com/)
	* glass-shatter ([Image](https://www.jing.fm/iclipt/u2q8u2a9o0t4i1q8/))
- [Playstation Trophies](https://www.playstationtrophies.org/)
	* guesspionage ([Question Data](https://www.playstationtrophies.org/game/the-jackbox-party-pack-3/trophy/157520-Guesspionage--Perfect-Surveillance.html))
- [PNG Arts](https://www.pngarts.com/)
	* police-tape ([Image](https://www.pngarts.com/explore/94078))
- [PNGFuel](https://www.pngfuel.com/)
	* communist ([Image](https://www.pngfuel.com/free-png/osnol))
- [pngimg.com](https://pngimg.com/)
	* thug-life ([Image](http://pngimg.com/download/58231))
- [PNGio.com](https://pngio.com/png)
	* car-race ([General Lee Car Image](https://pngio.com/images/png-a980119.html))
- [PNGkey.com](https://www.pngkey.com/)
	* car-race ([Sonic Car Image](https://www.pngkey.com/maxpic/u2e6y3t4a9o0a9a9/))
	* chess ([Piece Images](https://www.pngkey.com/maxpic/u2w7q8o0r5y3t4w7/))
- [PNGkit](https://www.pngkit.com/)
	* car-race ([Earnhardt Car Image](https://www.pngkit.com/bigpic/u2r5r5o0a9y3w7q8/))
- [PoetryDB](https://poetrydb.org/index.html)
	* poem ([API](https://github.com/thundercomb/poetrydb/blob/master/README.md))
- [Pokemon Fusion](https://pokemon.alexonsager.net/)
	* pokemon-fusion (Images)
- [PokéAPI](https://pokeapi.co/)
	* pokedex (API)
	* pokedex-ability (API)
	* pokedex-cry (API)
	* pokedex-image (API)
	* pokedex-item (API)
	* pokedex-location (API)
	* pokedex-move (API)
	* pokedex-moveset (API)
	* pokedex-stats (API)
	* pokemon-advantage (API)
	* smogon (API)
	* trainer-card (API)
	* whos-that-pokemon (API)
	* whos-that-pokemon-cry (API)
- [Pokécharms](https://pokecharms.com/)
	* trainer-card ([Trainer Card API](https://pokecharms.com/trainer-card-maker/))
- [Pokémon](https://www.pokemon.com/us/)
	* 3000-years (Image, Original Game)
	* dexter (Image, Original Anime)
	* hat (Ash Hat Original Anime)
	* name-rater (Sprite)
	* pokedex (Images, Original Game)
	* pokedex-ability (Original Game)
	* pokedex-cry (Original Game)
	* pokedex-image (Images, Original Game)
	* pokedex-item (Images, Original Game)
	* pokedex-location (Images, Original Game)
	* pokedex-move (Original Game)
	* pokedex-moveset (Images, Original Game)
	* pokedex-stats (Images, Original Game)
	* pokemon-advantage (Images, Original Game)
	* pokemon-fusion (Original Game)
	* smogon (Images, Original Game)
	* trainer-card (Images, Original Game)
	* whos-that-pokemon (Images, Original Game)
	* whos-that-pokemon-cry (Images, Original Game)
	* wild-pokemon (Image, Original Game)
	* wynaut (Image, Original Anime)
- [Pokémon Showdown](https://play.pokemonshowdown.com/)
	* pokedex ([Cry Sound Effects (Meltan and Melmetal)](https://play.pokemonshowdown.com/audio/cries/))
	* pokedex-cry ([Cry Sound Effects (Meltan and Melmetal)](https://play.pokemonshowdown.com/audio/cries/))
	* whos-that-pokemon ([Cry Sound Effects (Meltan and Melmetal)](https://play.pokemonshowdown.com/audio/cries/))
	* whos-that-pokemon-cry ([Cry Sound Effects (Meltan and Melmetal)](https://play.pokemonshowdown.com/audio/cries/))
- [Pornhub](https://www.pornhub.com/)
	* pornhub (Video Data)
- [Pottermore](https://my.pottermore.com/sorting)
	* sorting-hat (Original Quiz)
- [PsyCat Games](https://psycatgames.com/)
	* never-have-i-ever ([Statement Data](https://psycatgames.com/app/never-have-i-ever/))
- [PSYCHO-PASS](http://psycho-pass.com/)
	* psycho-pass (Original Anime)
- [Psycho-Pass Wiki](https://psychopass.fandom.com/wiki/Psycho-Pass_Wiki)
	* psycho-pass ([Crime Coefficient Levels Data](https://psychopass.fandom.com/wiki/Crime_Coefficient_(Index%29))
- [r/IsTodayFridayThe13th](https://www.reddit.com/r/IsTodayFridayThe13th/)
	* friday-the-13th (Concept)
- [Random-d.uk](https://random-d.uk/)
	* duck ([API](https://random-d.uk/api))
	* http-duck ([API](https://random-d.uk/http))
- [RandomFox](https://randomfox.ca/)
	* fox (API)
- [rdegges](https://github.com/rdegges)
	* yo-mama ([Joke Data](https://github.com/rdegges/yomomma-api/blob/master/jokes.txt))
- [Recipe Puppy](http://www.recipepuppy.com/)
	* recipe ([API](http://www.recipepuppy.com/about/api/))
- [RedBubble - Akbar Mna](https://www.redbubble.com/en/people/akbarmna/shop)
	* hat ([Megumin Hat Image](https://www.redbubble.com/people/akbarmna/works/25443591-megumins-hat-minimalistic?p=poster))
- [Reddit](https://www.reddit.com/)
	* awwnime ([API](https://www.reddit.com/dev/api/))
	* hentai ([API](https://www.reddit.com/dev/api/))
	* interesting ([API](https://www.reddit.com/dev/api/))
	* meme ([API](https://www.reddit.com/dev/api/))
	* news ([API](https://www.reddit.com/dev/api/))
	* porn ([API](https://www.reddit.com/dev/api/))
	* reddit ([API](https://www.reddit.com/dev/api/))
	* shower-thought ([API](https://www.reddit.com/dev/api/))
	* subreddit ([API](https://www.reddit.com/dev/api/))
- [Redeeming God](https://redeeminggod.com/)
	* approved ([Image](https://redeeminggod.com/courses/gospel-dictionary/lessons/gospel-dictionary-approved/))
- [RedKid.Net](http://www.redkid.net/)
	* hollywood-star ([Image](http://www.redkid.net/generator/star/))
- [Rest Countries](https://restcountries.eu/)
	* country (API)
- [richchurcher](https://github.com/richchurcher)
	* yoda ([API](https://github.com/richchurcher/yoda-api))
- [Rick Astley](https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw)
	* rickroll ([Original Music Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ))
- [Right Stuf Anime](https://www.rightstufanime.com/)
	* right-stuf (API)
- [Riot Games](https://www.riotgames.com/en)
	* league-of-legends ([API](https://developer.riotgames.com/))
- [RoadTrafficSigns](https://www.roadtrafficsigns.com/)
	* speed-limit ([Image](https://www.roadtrafficsigns.com/speed-limit-sign/speed-limit-70-sign/sku-x-r2-1-70.aspx))
- [RoboHash](https://robohash.org/)
	* robohash (API)
- [Robotatertot](https://robotatertot.tumblr.com/)
	* scroll-of-truth ([Image](https://robotatertot.tumblr.com/post/156736308530/truth))
- [Rockstar Games](https://www.rockstargames.com/)
	* soundboard (Here We Go Again Sound)
- [RogerHub Final Grade Calculator](https://rogerhub.com/final-grade-calculator/)
	* final-grade (Concept, Code)
- [Rotten Tomatoes](https://www.rottentomatoes.com/)
	* rotten-tomatoes (API)
- [Ryan Gutierrez](https://twitter.com/gootecks)
	* pogchamp (Image)
- [Safebooru](https://safebooru.org/)
	* safebooru (API)
- [Sam Thik](https://www.pinterest.com/Samthik/)
	* spotify-now-playing ([Image](https://www.pinterest.com/pin/500251471109108490/))
- [SeekPNG](https://www.seekpng.com/)
	* car-race ([Herbie Car Image](https://www.seekpng.com/ima/u2q8r5a9y3t4w7u2/))
- [SEGA](https://www.sega.com/)
	* car-race ([Sonic Car Original Design](https://www.sonicthehedgehog.com/))
	* sonic-says ([Image, Original "Sonic the Hedgehog" Game](https://www.sonicthehedgehog.com/))
- [Serebii.net](https://www.serebii.net/index2.shtml)
	* pokedex (Images)
	* pokedex-image (Images)
	* pokedex-location (Images)
	* pokedex-moveset (Images)
	* pokedex-stats (Images)
	* pokemon-advantage (Images)
	* smogon (Images)
	* whos-that-pokemon (Images)
	* whos-that-pokemon-cry (Images)
- [ShareFonts.net](https://www.wfonts.com/)
	* meme-gen-classic ([Impact Font](https://www.wfonts.com/font/impact))
- [Sherif Saad](https://www.behance.net/SherifSaad)
	* car-race ([AE86 Car Image](https://www.behance.net/gallery/62672149/AE86-Tattoo))
- [shibe.online](https://shibe.online/)
	* bird (API)
	* shiba (API)
- [Shields.io](https://shields.io/)
	* shields-io-badge (API)
- [Shrick](https://www.deviantart.com/shrick)
	* brony-speak ([English-to-Brony Dictionary Data](https://www.deviantart.com/shrick/art/Brony-dictionary-version-2-207157029))
- [Shutterstock](https://www.shutterstock.com/)
	* pokemon-advantage ([Background Image](https://www.shutterstock.com/video/search/anime-zoom))
- [Sigmath Bits](https://fontstruct.com/fontstructors/1280718/sigmath6)
	* undertale ([Pixelated Wingdings Font](https://fontstruct.com/fontstructions/show/1218140/pixelated-wingdings))
- [SinKillerJ Tachikawa](https://www.deviantart.com/sinkillerj)
	* steam-card ([Template](https://www.deviantart.com/sinkillerj/art/Steam-Trading-Card-Template-GIMP-372156984))
- [sl777123](https://www.deviantart.com/sl777123)
	* yu-gi-oh-gen ([Card Base Templates](https://www.deviantart.com/sl777123/gallery/64574029/templates))
- [SmileBASIC Source](https://smilebasicsource.com/)
	* smilebasic ([API](https://smilebasicsource.com/page?pid=1360))
- [Smogon](https://www.smogon.com/)
	* smogon (Tier Data)
- [SMWiki](http://www.smwiki.net/)
	* smw-level ([Level Name Data](http://old.smwiki.net/wiki/List_of_Super_Mario_World_levels))
- [Snapchat](https://www.snapchat.com/)
	* snapcode (API)
- [SPAM Brand](https://www.spam.com/)
	* spam (Image)
- [speak lolcat](https://speaklolcat.com/)
	* lolcat (Translation Data)
- [Speed Racer](https://www.speedracergogogo.com/)
	* car-race (Mach 5 Car Original Design)
- [Spongebob Fanon](https://spongebob-new-fanon.fandom.com/wiki/SpongeBob_Fanon_Wiki)
	* spongebob-time-card ([Images](https://spongebob-new-fanon.fandom.com/wiki/Gallery_of_Textless_Title_Cards))
- [Spotify](https://www.spotify.com/us/)
	* spotify-now-playing (Original Design)
- [Square Enix](https://square-enix-games.com/)
	* nobody-name ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
	* sora-selfie ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
- [Stack Exchange](https://stackexchange.com/)
	* stack-overflow ([API](https://api.stackexchange.com/docs))
- [Stadium Talk](https://www.stadiumtalk.com/)
	* horse-race ([Horse Name Data](https://www.stadiumtalk.com/s/best-racehorse-names-be7b8ad6b49a42df))
- [Star Wars](https://www.starwars.com/)
	* car-race (Anakin Car Original Design)
	* soundboard (Hello There Sound)
- [Steam](https://store.steampowered.com/)
	* steam (API)
	* steam-card ([Original Design](https://steamcommunity.com/tradingcards/))
	* steam-now-playing (Original Design)
	* steam-now-playing-classic (Original Design)
- [Steven Crowder](https://www.youtube.com/StevenCrowder)
	* change-my-mind ([Image](https://twitter.com/scrowder/status/964577508447449088))
- [Stick PNG](https://www.stickpng.com/)
	* car-race ([Horse Car Image](https://www.stickpng.com/img/animals/horses/race-horse-side-view))
- [StickPNG](https://www.stickpng.com/)
	* hat ([Mask Hat Image](https://www.stickpng.com/img/science/pandemic/white-surgical-face-mask-front-view))
- [Straw Poll](https://www.strawpoll.me/)
	* strawpoll ([API](https://github.com/strawpoll/strawpoll/wiki/API))
- [Superpower Wiki](https://powerlisting.fandom.com/wiki/Superpower_Wiki)
	* superpower (Superpower Data)
- [susi1959](https://en.picmix.com/profile/susi1959)
	* fire-frame ([Image](https://en.picmix.com/stamp/FIRE-FRAME-ORANGE-cadre-feu-orange-360274))
- [Tatsumaki](https://tatsumaki.xyz/)
	* beautiful (Image)
	* fishy (Concept)
	* phone (Concept)
	* psycho-pass (Concept)
- [Teasing Master Takagi-san](https://takagi3.me/)
	* chi-idea (Original "Teasing Master Takagi-san" Manga)
- [Tenor](https://tenor.com/)
	* tenor ([API](https://tenor.com/gifapi/documentation))
- [Tesla](https://www.tesla.com/)
	* car-race ([Cybertruck Car Original Design](https://www.tesla.com/cybertruck))
- [The BLOODHOUND Project](https://www.bloodhoundlsr.com/)
	* car-race ([Bloodhound Car Image/Original Design](http://sendy.bloodhoundssc.com/w/r66GIuC7uX1SMJnEzBQclA/RYS3PGArp6y5QLtigCCOVA/3JZqlel0Hcux67634uBAdtpg))
- [The Hill](https://thehill.com/)
	* alert ([Image](https://thehill.com/policy/technology/409737-this-is-a-test-us-officials-test-presidential-alert))
- [The Internet Chuck Norris Database](http://www.icndb.com/)
	* chuck-norris ([API](http://www.icndb.com/api/))
- [The Melancholy of Haruhi Suzumiya](http://www.haruhi.tv/)
	* kyon-gun (Original Anime)
- [The Movie Database](https://www.themoviedb.org/)
	* movie ([API](https://www.themoviedb.org/documentation/api))
	* tv-show ([API](https://www.themoviedb.org/documentation/api))
- [The Newspaper Clipping Generator](https://www.fodey.com/generators/newspaper/snippet.asp)
	* newspaper (API)
- [The Onion](https://www.theonion.com/)
	* the-onion ([RSS Feed](https://www.theonion.com/rss))
- [The Sounds Resource](https://www.sounds-resource.com/)
	* pokedex ([Cry Sound Effects (Gen 8)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
	* pokedex ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
	* pokedex-cry ([Cry Sound Effects (Gen 8)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
	* pokedex-cry ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
	* whos-that-pokemon ([Cry Sound Effects (Gen 8)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
	* whos-that-pokemon ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
	* whos-that-pokemon-cry ([Cry Sound Effects (Gen 8)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
	* whos-that-pokemon-cry ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
- [TheCatAPI](https://thecatapi.com/)
	* cat ([API](https://docs.thecatapi.com/))
- [theraymachine](https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/overview)
	* car-race ([DeLorean Car Image](https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/gallery/all/decal/1679092/7359459034929333784))
- [This Artwork Does Not Exist](https://thisartworkdoesnotexist.com/)
	* ai-artwork (API)
- [This Cat Does Not Exist](https://thiscatdoesnotexist.com/)
	* ai-cat (API)
- [This Fursona Does Not Exist](http://thisfursonadoesnotexist.com/)
	* ai-fursona (API)
- [This Horse Does Not Exist](https://thishorsedoesnotexist.com/)
	* ai-horse (API)
- [This Person Does Not Exist](https://thispersondoesnotexist.com/)
	* ai-person (API)
- [This Snack Does Not Exist](https://thissnackdoesnotexist.com/)
	* food (API)
- [This Vessel Does Not Exist](https://thisvesseldoesnotexist.com/#/)
	* ai-vase (API)
- [This Waifu Does Not Exist](https://www.thiswaifudoesnotexist.net/)
	* ai-waifu (API)
- [Thum.io](https://www.thum.io/)
	* screenshot (API)
- [Tim's Printables](https://www.timvandevall.com/)
	* wanted ([Image](https://www.pinterest.com/pin/365002744774849370/))
- [TrueAchievements](https://www.trueachievements.com/)
	* guesspionage ([Question Data](https://www.trueachievements.com/forum/viewthread.aspx?tid=850920))
- [Tumblr](https://www.tumblr.com/)
	* tumblr ([API](https://www.tumblr.com/docs/en/api/v2))
- [Turning Point USA](https://www.tpusa.com/)
	* dear-liberals (Image)
- [TVS Racing](https://www.tvsracing.com/)
	* car-race (Motorcycle Car Image)
- [Twitter](https://twitter.com/)
	* tweet ([Image, API](https://developer.twitter.com/en/docs.html))
	* twitter ([API](https://developer.twitter.com/en/docs.html))
- [u/_Ebb](https://www.reddit.com/user/_Ebb)
	* eat-pant ([Image](https://www.reddit.com/r/Ooer/comments/52z589/eat_pant_maaaaaaaan/))
- [u/AelinSA](https://www.reddit.com/user/AelinSA)
	* dark-light ([Image](https://www.reddit.com/r/discordapp/comments/9krnhr/preach_the_message_of_the_möth_with_this_magi))
- [u/CaptainRako](https://www.reddit.com/user/CaptainRako/)
	* whos-that-pokemon ([Background Image](https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/))
	* whos-that-pokemon-cry ([Background Image](https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/))
- [u/guschuma](https://www.reddit.com/user/guschuma/)
	* waldo ([Concept](https://www.reddit.com/r/copypasta/comments/gkk7z1/wheres_waldo_game_created_by_me/))
- [u/LennyMcLennington](https://www.reddit.com/user/LennyMcLennington)
	* dark-light ([Image](https://www.reddit.com/r/discordapp/comments/8t04ag/this_image_shows_different_text_depending_on/))
- [u/MoonlightCapital](https://www.reddit.com/user/MoonlightCapital/)
	* dark-light ([Image](https://www.reddit.com/r/discordapp/comments/a9fr7x/troll_your_friends_with_this/))
- [u/N1ffler](https://www.reddit.com/user/N1ffler/)
	* sorting-hat ([Sorting Hat Quiz Analysis Data](https://www.reddit.com/r/Pottermore/comments/44os14/pottermore_sorting_hat_quiz_analysis/))
- [u/PowderedShmegma](https://www.reddit.com/user/PowderedShmegma/)
	* lego-icon ([Image](https://www.reddit.com/r/legostarwars/comments/eheb76/lego_sw_character_icon_template/))
- [u/SupremeMemesXD](https://www.reddit.com/user/SupremeMemesXD/)
	* girl-worth-fighting-for ([Image](https://www.reddit.com/r/MemeTemplatesOfficial/comments/8h39vi/girl_worth_fighting_for_template/))
- [u/THANOS_COPTER](https://www.reddit.com/user/THANOS_COPTER/)
	* chi-idea ([Image](https://www.reddit.com/r/Takagi_san/comments/gb4wdt/how_far_is_too_far/))
- [u/Two-Tone-](https://www.reddit.com/user/Two-Tone-/)
	* genie-rules ([Image](https://www.reddit.com/r/MemeTemplatesOfficial/comments/bht9o6/i_made_an_hd_high_quality_version_of_the_4_rules/))
- [UncleKornicob](http://soundbible.com/)
	* soundboard ([Alarm Sound](http://soundbible.com/1787-Annoying-Alarm-Clock.html))
- [UNDERTALE](https://undertale.com/)
	* temmie (Original Game)
	* undertale (Original Game)
- [United States Judo Federation](https://www.usjf.com/)
	* pokemon-advantage ([Stars Image](https://www.usjf.com/2019/11/five-star-dojo-program/))
- [Unsplash](https://unsplash.com/)
	* stock-photo ([API](https://unsplash.com/developers))
- [Urban Dictionary](https://www.urbandictionary.com/)
	* urban ([API](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation))
- [USPS](https://www.usps.com/)
	* usps-tracking ([API](https://www.usps.com/business/web-tools-apis/))
- [Valve](https://www.valvesoftware.com/en/)
	* fact-core ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
	* i-fear-no-man ([Image, Original "Team Fortress 2" Game](https://www.teamfortress.com/))
	* oracle-turret ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
	* soundboard ([Slow Clap Sound](http://www.thinkwithportals.com/))
- [vician](https://www.123rf.com/profile_vician)
	* rip ([Image](https://www.123rf.com/profile_vician?mediapopup=13181623))
- [VocaDB](https://vocadb.net/)
	* vocadb ([API](https://vocadb.net/swagger/ui/index))
- [Vocodes](https://vo.codes/)
	* vocodes (API)
- [Wait, what does your startup do?](http://itsthisforthat.com/)
	* this-for-that ([API](http://itsthisforthat.com/api.php))
- [WAIT: What Anime Is This?](https://trace.moe/)
	* what-anime ([API](https://soruly.github.io/trace.moe/#/))
- [Walter E Stewart](https://www.1001freefonts.com/designer-walter-e-stewart-fontlisting.php)
	* sos ([Sun Dried Font](https://www.1001freefonts.com/sun-dried.font))
- [Warner Bros.](https://www.warnerbros.com/)
	* car-race (General Lee Car Original Design)
	* phoebe-teaching-joey ([Images, Original "Friends" TV Series](https://www.warnerbros.com/tv/friends/))
	* this-guy ([Image, Original "Friends" TV Series](https://www.warnerbros.com/tv/friends/))
- [Wattpad](https://www.wattpad.com/)
	* wattpad ([API](https://www.wattpad.com/developer/docs/api))
- [wavebeem](https://github.com/wavebeem)
	* pokemon-advantage ([Type Advantage Data](https://github.com/wavebeem/pkmn.help/blob/master/src/data.ts))
- [WebStockReview](https://webstockreview.net/)
	* hat ([Devil Hat Image](https://webstockreview.net/explore/horn-clipart-purple-devil/))
- [Why We Protest](https://whyweprotest.net/)
	* hat ([Anon Hat Image](https://whyweprotest.net/threads/big-ass-guy-fawkes-mask-images-thread.22719/))
- [wikiHow](https://www.wikihow.com/Main-Page)
	* wikihow ([API](https://www.wikihow.com/api.php))
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
	* caution ([Image](https://commons.wikimedia.org/wiki/File:Caution_blank.svg))
	* danger ([Image](https://commons.wikimedia.org/wiki/File:Danger_blank.svg))
- [Wikipedia](https://www.wikipedia.org/)
	* fact ([API](https://en.wikipedia.org/w/api.php))
	* idiot (URL)
	* itunes ([Language Code Data](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes))
	* time ([Time Zone Data](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
	* wikipedia ([API](https://en.wikipedia.org/w/api.php))
- [Will You Press The Button?](https://willyoupressthebutton.com/)
	* will-you-press-the-button (API)
- [Wisq](https://www.youtube.com/channel/UCrOS0iXaZgW45AdbEznGXLA)
	* eject ([Images](https://www.youtube.com/watch?v=yx4Hp8TBVtQ))
- [World of Tanks](https://worldoftanks.com/)
	* simp ([Image](https://worldoftanks.com/es-ar/content/silver-league/open-standings/))
- [www.aljanh.net](http://www.aljanh.net/)
	* frame ([Classic Image](http://www.aljanh.net/frame-wallpapers/1508614706.html))
- [xertris](https://www.deviantart.com/xertris)
	* hat ([Dunce Hat Image](https://www.deviantart.com/xertris/art/Dunce-Cap-634349483))
- [xkcd](https://xkcd.com/)
	* xkcd ([API](https://xkcd.com/json.html))
- [Yahoo](https://www.yahoo.com/)
	* stocks (Finance API)
- [Yeah I'm Stuck in the Void, Keep Scrolling](https://www.facebook.com/voidmanthing/)
	* metamorphosis ([Image](https://www.facebook.com/voidmanthing/posts/125724262420450))
- [YGOPRODECK](https://ygoprodeck.com/)
	* yu-gi-oh ([API](https://db.ygoprodeck.com/api-guide/))
- [zekewhipper](https://www.deviantart.com/zekewhipper)
	* car-race ([Mach 5 Car Image](https://www.deviantart.com/zekewhipper/art/Mach-5-My-Version-112814534))
- [Zero Error's randomised blog](http://yanko06.blogspot.com/)
	* car-race ([Lego Car Image](http://yanko06.blogspot.com/2016/03/nissan-240sx-lego-build.html))
