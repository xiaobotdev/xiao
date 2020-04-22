<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="Xiao" src="https://i.imgur.com/R0D0f39.png">  

# Xiao
[![Build Status](https://travis-ci.org/dragonfire535/xiao.svg?branch=master)](https://travis-ci.org/dragonfire535/xiao)
[![Donate on PayPal](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.me/dragonfire535)
[![Discord](https://discordapp.com/api/guilds/252317073814978561/embed.png)](https://discord.gg/mTr83zt)

Xiao is a Discord bot coded in JavaScript with
[discord.js](https://discord.js.org/) using the
[Commando](https://github.com/discordjs/Commando) command framework. With over
350 commands, she is one of the most feature-rich bots out there. Formerly
"XiaoBot".

## Table of Contents

- [Invite](#invite)
- [Permissions](#permissions)
- [Fun Information](#fun-information)
- [Installing](#installing)
	* [Before You Begin](#before-you-begin)
	* [Windows](#windows)
	* [Mac](#mac)
	* [Ubuntu and other Debian-based systems](#ubuntu-and-other-debian-based-systems)
- [Related Bots](#related-bots)
- [Options](#Options)
- [Commands](#commands)
	* [Utility](#utility)
	* [Discord Information](#discord-information)
	* [Random Response](#random-response)
	* [Random Image](#random-image)
	* [Single Response](#single-response)
	* [Automatic Response](#automatic-response)
	* [Seeded Randomizers](#seeded-randomizers)
	* [Events](#events)
	* [Search](#search)
	* [Analyzers](#analyzers)
	* [Single-Player Games](#single-player-games)
	* [Multi-Player Games](#multi-player-games)
	* [Image Manipulation](#image-manipulation)
	* [Avatar Manipulation](#avatar-manipulation)
	* [Meme Generators](#meme-generators)
	* [Text Manipulation](#text-manipulation)
	* [Number Manipulation](#number-manipulation)
	* [Other](#other)
	* [Roleplay](#roleplay)
	* [README Generators](#readme-generators)
- [Other Features](#other-features)
- [Licensing](#licensing)
- [Credit](#credit)

## Invite
- [Home Server](https://discord.gg/mTr83zt)
- [Invite](https://discordapp.com/api/oauth2/authorize?client_id=278305350804045834&permissions=104721601&scope=bot)

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
- **Embed Links** is required to allow commands that send embeds to work. Too many commands to list use it.
- **Attach Files** is required to allow commands that send files to work. Too many commands to list use it.
- **Read Message History** allows Xiao to use the `first-message` and `prune` commands.
- **Use External Emojis** allows Xiao to use custom emoji in certain commands.
	* While the commands benefit from it, it is not required for the commands to work.
- **Add Reactions** allows Xiao to use commands that add reactions to messages in certain commands.
	* While the commands benefit from it, it is not requried for the commands to work.


## Fun Information
- 350+ Commands
- 17,000+ lines of JavaScript
- 59,000+ lines of JSON data
- 3 years of development
- 3,000+ commits

## Installing

### Before You Begin

1. Make sure you have installed [Node.js](https://nodejs.org/en/) (you will need **at least v12.0.0**) and [Git](https://git-scm.com/).
2. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
3. Run `cd xiao` to move into the folder that you just created.
4. Create a file named `.env` and fill it out as shown in `.env.example`.

### Windows

1. Open an **ADMIN POWERSHELL** window and run `npm i -g --production windows-build-tools`.
2. [Follow these instructions to install the dependencies for `node-canvas`](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows).
3. [Follow these instructions to install ffmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows).
4. Run `npm i --production` in the folder you cloned the bot.
5. Run `npm i -g pm2` to install PM2.
6. Run `pm2 start Xiao.js --name xiao` to run the bot.

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
6. Run `npm i --production` in the folder you cloned the bot.
7. Run `npm i -g pm2` to install PM2.
8. Run `pm2 start Xiao.js --name xiao` to run the bot.

## Related Bots

* [Rando Cardrissian](https://github.com/dragonfire535/rando-cardrissian) is a Cards Against Humanity bot, whose features were originally built into Xiao.

## Options

Options in Xiao are configured using channel topics. Place the option
in the appropriate channel's topic to use it.

* `<xiao:disable-leave>` Disables leave messages (Place in the channel you recieve welcome messages in).
* `<xiao:phone>` Allows a channel to recieve phone calls from the `phone` command.
* `<xiao:phone-book:hide>` Hides a channel from the `phone-book` command.
* `<xiao:portal>` Allows a channel to recieve portal messages from the `portal-send` command.

## Commands

Total: 399

### Utility:

* **eval:** Executes JavaScript code. (Owner-Only)
* **changelog:** Responds with the bot's latest 10 commits.
* **cloc:** Responds with the bot's code line count.
* **credit:** Responds with a command's credits list.
* **donate:** Responds with the bot's donation links.
* **help:** Displays a list of available commands, or detailed information for a specific command.
* **info:** Responds with detailed bot information.
* **invite:** Responds with the bot's invite links.
* **ip:** Responds with the IP address the bot's server is running on. (Owner-Only)
* **options:** Responds with a list of server options.
* **ping:** Checks the bot's ping to the Discord server.
* **report:** Reports something to the bot owner(s).
* **shutdown:** Shuts down the bot. (Owner-Only)

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
* **advice:** Responds with a random bit of advice.
* **axis-cult:** Responds with a teaching of the Axis Cult.
* **cat-fact:** Responds with a random cat fact.
* **charlie-charlie:** Asks your question to Charlie.
* **choose:** Chooses between options you provide.
* **chuck-norris:** Responds with a random Chuck Norris joke.
* **coin:** Flips a coin.
* **compliment:** Compliments a user.
* **dog-fact:** Responds with a random dog fact.
* **draw-cards:** Draws a random hand of playing cards.
* **fact-core:** Responds with a random Fact Core quote.
* **fact:** Responds with a random fact.
* **fortune:** Responds with a random fortune.
* **github-zen:** Responds with a random GitHub design philosophy.
* **joke:** Responds with a random joke.
* **kiss-marry-kill:** Determines who to kiss, who to marry, and who to kill.
* **light-novel-title:** Responds with a randomly generated Light Novel title.
* **magic-conch:** Asks your question to the Magic Conch.
* **name:** Responds with a random name, with the gender of your choice.
* **number-fact:** Responds with a random fact about a specific number.
* **offspring:** Determines if your new child will be a boy or a girl.
* **opinion:** Determines the opinion on something.
* **oracle-turret:** Responds with a random Oracle Turret quote.
* **pun:** Responds with a random pun.
* **quantum-coin:** Flips a coin that lands on some form of nothing.
* **quote:** Responds with a random quote.
* **random-user:** Randomly chooses a member of the server.
* **rate:** Rates something.
* **roast:** Roasts a user.
* **roll:** Rolls a dice with a minimum/maximum value of your choice.
* **security-key:** Responds with a random security key.
* **shower-thought:** Responds with a random shower thought, directly from r/Showerthoughts.
* **smw-level:** Responds with a random Super Mario World level name.
* **subreddit:** Responds with a random post from a subreddit.
* **suggest-command:** Suggests a random command for you to try.
* **superpower:** Responds with a random superpower.
* **this-for-that:** So, basically, it's like a bot command for this dumb meme.
* **waifu:** Responds with a randomly generated waifu and backstory.
* **would-you-rather:** Responds with a random "Would you rather ...?" question.
* **xiao-fact:** Responds with a random fact about Xiao.

### Random Image:

* **bird:** Responds with a random image of a bird.
* **cat:** Responds with a random cat image.
* **dog:** Responds with a random dog image.
* **duck:** Responds with a random duck image.
* **fidget:** Responds with a random image of Fidget.
* **fox:** Responds with a random fox image.
* **karen:** Responds with a random image of Karen.
* **lando:** Responds with a random image of Lando Calrissian.
* **light-novel-cover:** Responds with a randomly generated Light Novel cover. (NSFW)
* **meme:** Responds with a random meme.
* **potato:** Responds with a random potato image.
* **shiba:** Responds with a random image of a Shiba Inu.
* **xiao:** Responds with a random image of Xiao Pai.

### Seeded Randomizers:

* **butt:** Determines a user's butt quality.
* **coolness:** Determines a user's coolness.
* **dick:** Determines your dick size. (NSFW)
* **friendship:** Determines how good friends two users are.
* **guess-looks:** Guesses what a user looks like.
* **iq:** Determines a user's IQ.
* **psycho-pass:** Determines your Crime Coefficient.
* **ship:** Ships two users together.
* **smash-or-pass:** Determines if a user is worthy of a smash or a pass.

### Single Response:

* **dark-light:** Determines whether you use dark or light theme.
* **eat-pant:** Eat pant.
* **eggs-get-laid:** Sends the ultimate roast.
* **fly:** Sends a fake fly that looks surprisngly real.
* **give-flower:** Gives Xiao Pai a flower.
* **hi:** Hello.
* **idiot:** Responds with the Wikipedia page of an idiot.
* **isnt-joke:** Isn't joke...
* **its-joke:** It's joke!
* **just-do-it:** Sends a link to the "Just Do It!" motivational speech.
* **lenny:** Responds with the lenny face.
* **spam:** Responds with a picture of Spam.
* **tableflip:** Flips a table... With animation!
* **wynaut:** Why not? Wynaut?
* **yoff:** Posts a picture that truly defines modern art.

### Automatic Response:

* **can-you-not:** Can YOU not?
* **kazuma-kazuma:** Hai, Kazuma desu.
* **no-u:** no u
* **suicide-hotline:** Responds with the phone number for the Suicide Hotline.
* **unflip:** Unflips a flipped table.

### Events:

* **anime-airing:** Responds with a list of the anime that air today.
* **apod:** Responds with today's Astronomy Picture of the Day.
* **calendar:** Responds with today's holidays.
* **days-until:** Responds with how many days there are until a certain date.
* **doomsday-clock:** Responds with the current time of the Doomsday Clock.
* **friday-the-13th:** Determines if today is Friday the 13th.
* **google-doodle:** Responds with a Google Doodle, either the latest one or a random one from the past.
* **horoscope:** Responds with today's horoscope for a specific Zodiac sign.
* **humble-bundle:** Responds with the current Humble Bundle.
* **is-tuesday:** Determines if today is Tuesday.
* **iss:** Responds with where the Internation Space Station currently is.
* **neko-atsume-password:** Responds with today's Neko Atsume password.
* **people-in-space:** Responds with the people currently in space.
* **time:** Responds with the current time in a particular location.
* **today-in-history:** Responds with an event that occurred today in history.

### Search:

* **anime:** Searches AniList for your query, getting anime results.
* **book:** Searches Google Books for a book.
* **bulbapedia:** Searches Bulbapedia for your query.
* **character:** Searches AniList for your query, getting character results.
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
* **periodic-table:** Finds an element on the periodic table.
* **pokedex:** Searches the Pokédex for a Pokémon.
* **recipe:** Searches for recipes based on your query.
* **reddit:** Responds with information on a Reddit user.
* **right-stuf:** Searches Right Stuf Anime for your query.
* **rotten-tomatoes:** Searches Rotten Tomatoes for your query.
* **rule:** Responds with a rule of the internet.
* **safebooru:** Responds with an image from Safebooru, with optional query.
* **soundcloud:** Searches SoundCloud for your query.
* **stack-overflow:** Searches Stack Overflow for your query.
* **steam:** Searches Steam for your query.
* **stocks:** Responds with the current stocks for a company.
* **tenor:** Searches Tenor for your query.
* **tumblr:** Responds with information on a Tumblr blog.
* **tv-show:** Searches TMDB for your query, getting TV show results.
* **twitter:** Responds with information on a Twitter user.
* **urban:** Defines a word, but with Urban Dictionary. (NSFW)
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

### Analyzers:

* **age:** Responds with how old someone born in a certain year is.
* **birthstone:** Responds with the Birthstone for a month.
* **character-count:** Responds with the character count of text.
* **chinese-zodiac:** Responds with the Chinese Zodiac Sign for the given year.
* **face:** Determines the race, gender, and age of a face.
* **gender:** Determines the gender of a name.
* **has-transparency:** Determines if an image has transparency in it.
* **read-qr-code:** Reads a QR Code.
* **scrabble-score:** Responds with the scrabble score of a word.
* **severe-toxicity:** Determines the toxicity of text, but less sensitive to milder language.
* **toxicity:** Determines the toxicity of text.
* **what-anime:** Determines what anime a screenshot is from.
* **zodiac-sign:** Responds with the Zodiac Sign for the given month/day.

### Single-Player Games:

* **blackjack:** Play a game of blackjack.
* **box-choosing:** Do you believe that there are choices in life? Taken from Higurashi Chapter 4.
* **bubble-wrap:** Pop some bubble wrap.
* **captcha:** Try to guess what the captcha says.
* **chance:** Attempt to win with a 1 in 1000 (or your choice) chance of winning.
* **doors:** Open the right door, and you win the money! Make the wrong choice, and you get the fire!
* **fishy:** Go fishing.
* **google-feud:** Attempt to determine the top suggestions for a Google search.
* **hangman:** Prevent a man from being hanged by guessing a word as fast as you can.
* **horse-race:** Bet on the fastest horse in a 6-horse race.
* **hunger-games:** Simulate a Hunger Games match with up to 24 tributes.
* **lottery:** Attempt to win the lottery with 6 numbers.
* **mad-libs:** Choose words that fill in the blanks to create a crazy story!
* **math-quiz:** See how fast you can answer a math problem in a given time limit.
* **quiz:** Answer a quiz question.
* **rock-paper-scissors:** Play Rock-Paper-Scissors.
* **roulette:** Play a game of roulette.
* **slots:** Play a game of slots.
* **sorting-hat:** Take a quiz to determine your Hogwarts house.
* **typing-test:** See how fast you can type a sentence in a given time limit.
* **whos-that-pokemon:** Guess who that Pokémon is.

### Multi-Player Games:

* **balloon-pop:** Don't let yourself be the last one to pump the balloon before it pops!
* **battle:** Engage in a turn-based battle against another user or the AI.
* **connect-four:** Play a game of Connect Four with another user.
* **dots-and-boxes:** Play a game of Dots and Boxes with another user.
* **emoji-emoji-revolution:** Can you type arrow emoji faster than anyone else has ever typed them before?
* **guesspionage:** Tests your knowledge of humans as you guess how people responded to poll questions.
* **gunfight:** Engage in a western gunfight against another user. High noon.
* **pick-a-number:** Two players pick a number between 1 and 10. Whoever's closer wins.
* **quiz-duel:** Answer a series of quiz questions against an opponent.
* **russian-roulette:** Who will pull the trigger and die first?
* **tic-tac-toe:** Play a game of tic-tac-toe with another user.
* **word-chain:** Try to come up with words that start with the last letter of your opponent's word.

### Image Manipulation:

* **achievement:** Sends a Minecraft achievement with the text of your choice.
* **adorable:** Creates an adorable avatar based on the text you provide.
* **apple-engraving:** Engraves the text of your choice onto an Apple product.
* **approved:** Draws an "approved" stamp over an image or a user's avatar.
* **axis-cult-sign-up:** Sends an Axis Cult Sign-Up sheet for you. Join today!
* **bart-chalkboard:** Sends a "Bart Chalkboard" meme with the text of your choice.
* **brazzers:** Draws an image with the Brazzers logo in the corner. (NSFW)
* **certificate:** Sends a certificate of excellence with the name and reason of your choice.
* **circle:** Draws an image or a user's avatar as a circle.
* **color:** Sends an image of the color you choose.
* **contrast:** Draws an image or a user's avatar but with contrast.
* **create-qr-code:** Converts text to a QR Code.
* **dexter:** Draws an image or a user's avatar over the screen of Dexter from Pokémon.
* **distort:** Draws an image or a user's avatar but distorted.
* **fire:** Draws a fiery border over an image or a user's avatar.
* **frame:** Draws a frame around an image or a user's avatar.
* **ghost:** Draws an image or a user's avatar but with a ghost-like transparency.
* **glass-shatter:** Draws an image or a user's avatar with a glass shatter in front of it.
* **glitch:** Draws an image or a user's avatar but glitched.
* **greyscale:** Draws an image or a user's avatar in greyscale.
* **hollywood-star:** Sends a Hollywood Walk of Fame star with the name of your choice.
* **ifunny:** Draws an image with the iFunny logo.
* **invert:** Draws an image or a user's avatar but inverted.
* **jeopardy-question:** Sends a Jeopardy Question with the text of your choice.
* **minecraft-skin:** Sends the Minecraft skin for a user.
* **mirror:** Draws an image or a user's avatar but mirrored on the X/Y axis (or both).
* **needs-more-jpeg:** Draws an image or a user's avatar as a low quality JPEG.
* **newspaper:** Creates a fake newspaper with the headline and body of your choice.
* **pixelize:** Draws an image or a user's avatar pixelized.
* **pokemon-fusion:** Fuses two Generation I Pokémon together.
* **police-tape:** Draws police tape over an image or a user's avatar.
* **rainbow:** Draws a rainbow over an image or a user's avatar.
* **rejected:** Draws a "rejected" stamp over an image or a user's avatar.
* **robohash:** Creates a robot based on the text you provide.
* **sepia:** Draws an image or a user's avatar in sepia.
* **shields-io-badge:** Creates a badge from shields.io.
* **silhouette:** Draws a silhouette of an image or a user's avatar.
* **square:** Draws an image or a user's avatar as a square.
* **tint:** Draws an image or a user's avatar but tinted a specific color.

### Avatar Manipulation:

* **avatar-fusion:** Draws a a user's avatar over a user's avatar.
* **bob-ross:** Draws a user's avatar over Bob Ross' canvas.
* **hat:** Draws a hat over a user's avatar.
* **he-lives-in-you:** Draws a user's avatar over Simba from The Lion King's reflection.
* **hearts:** Draws hearts around a user's avatar.
* **i-have-the-power:** Draws a user's avatar over He-Man's face.
* **look-what-karen-have:** Draws a user's avatar over Karen's piece of paper.
* **rip:** Draws a user's avatar over a gravestone.
* **sip:** Draws a user's avatar sipping tea.
* **status-button:** Creates a Discord status button from c99.nl.
* **steam-card:** Draws a user's avatar on a Steam Trading Card.
* **steam-now-playing-classic:** Draws a user's avatar over a Steam "now playing" notification (old skin).
* **steam-now-playing:** Draws a user's avatar over a Steam "now playing" notification.
* **triggered:** Draws a user's avatar over the "Triggered" meme.
* **wanted:** Draws a user's avatar over a wanted poster.
* **yu-gi-oh-token:** Draws a user's avatar over a blank Yu-Gi-Oh! Token card.

### Meme Generators:

* **3000-years:** Draws an image or a user's avatar over Pokémon's "It's been 3000 years" meme.
* **be-like-bill:** Sends a "Be Like Bill" meme with the name of your choice.
* **beautiful:** Draws a user's avatar over Gravity Falls' "Oh, this? This is beautiful." meme.
* **challenger:** Draws an image or a user's avatar over Smash Bros.'s "Challenger Approaching" screen.
* **cursed-sponge:** Sends a cursed sponge duplicated however many times you want.
* **dear-liberals:** Sends a "Dear Liberals" meme with words of your choice.
* **demotivational:** Draws an image or a user's avatar and the text you specify as a demotivational poster.
* **distracted-boyfriend:** Draws three user's avatars over the "Distracted Boyfriend" meme.
* **drakeposting:** Draws two user's avatars over the "Drakeposting" meme.
* **food-broke:** Draws a user's avatar over the "Food Broke" meme.
* **girl-worth-fighting-for:** Draws an image or a user's avatar as the object of Ling's affection.
* **gru-plan:** Sends a Gru's Plan meme with steps of your choice.
* **illegal:** Makes President Trump make your text illegal.
* **kyon-gun:** Draws an image or a user's avatar behind Kyon shooting a gun.
* **lisa-presentation:** Sends a "Lisa Presentation" meme with the presentation of your choice.
* **look-at-this-photograph:** Draws an image or a user's avatar over Nickelback's photograph.
* **meme-gen:** Sends a meme with the text and background of your choice.
* **new-password:** Sends a "Weak Password/Strong Password" meme with the passwords of your choice.
* **nike-ad:** Sends a "Believe in Something" Nike Ad meme with the text of your choice.
* **plankton-plan:** Sends a Plankton's Plan meme with steps of your choice.
* **sora-selfie:** Draws an image or a user's avatar behind Sora taking a selfie.
* **sos:** Sends a "Esther Verkest's Help Sign" comic with the text of your choice.
* **spongebob-burn:** Sends a "Spongebob Throwing Something into a Fire" meme with words of your choice.
* **thug-life:** Draws "Thug Life" over an image or a user's avatar.
* **to-be-continued:** Draws an image with the "To Be Continued..." arrow.
* **ultimate-tattoo:** Draws an image or a user's avatar as "The Ultimate Tattoo".
* **vietnam-flashbacks:** Edits Vietnam flashbacks behind an image or a user's avatar.
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
* **say:** Make me say what you want, master.
* **sha-1:** Creates a hash of text with the SHA-1 algorithm.
* **sha-256:** Creates a hash of text with the SHA-256 algorithm.
* **ship-name:** Creates a ship name from two names.
* **shuffle:** Shuffles text.
* **snake-speak:** Convertsssss text to sssssnake ssssspeak.
* **spoiler-letter:** Sends text with each and every character as an individual spoiler.
* **superscript:** Converts text to tiny text.
* **tebahpla:** Reverses the alphabet of text.
* **temmie:** Converts text to Temmie speak.
* **translate:** Translates text to a specific language.
* **unspoiler:** Removes all spoilers from a message.
* **uppercase:** Converts text to uppercase.
* **upside-down:** Flips text upside-down.
* **url-decode:** Decodes URL characters to regular characters.
* **url-encode:** Encodes text to URL-friendly characters.
* **webhook:** Posts a message to the webhook defined in the bot owner's `process.env`. (Owner-Only)
* **yoda:** Converts text to Yoda speak.
* **zalgo:** Converts text to zalgo.

### Number Manipulation:

* **currency:** Converts currency from one currency to another.
* **final-grade:** Determines the grade you need to make on your final to get your desired course grade.
* **grade:** Determines your grade on an assignment on an 100-point scale.
* **gravity:** Determines weight on another planet.
* **math:** Evaluates a math expression.
* **prime:** Determines if a number is a prime number.
* **roman:** Converts a number to roman numerals.
* **scientific-notation:** Converts a number to scientific notation.
* **tax:** Determines the total cost of something plus tax.
* **units:** Converts units to/from other units.

### Other:

* **cleverbot:** Talk to Cleverbot. (Owner-Only)
* **phone-book:** Looks up phone-enabled servers.
* **phone:** Starts a phone call with a random server.
* **portal-send:** Send a message to a portal channel.
* **prune:** Deletes up to 99 messages from the current channel.
* **rename-all:** Renames every member of the server. (Owner-Only)
* **strawpoll:** Generates a Strawpoll with the options you provide.

### Roleplay:

* **blush:** Blushes at a user.
* **bro-hoof:** Gives a user a bro hoof.
* **celebrate:** Celebrates.
* **eat:** Feeds a user.
* **fist-bump:** Fist-bumps a user.
* **high-five:** High Fives a user.
* **hold-hands:** Holds hands with a user.
* **hug:** Hugs a user.
* **kill:** Kills a user.
* **kiss:** Kisses a user.
* **pat:** Pats a user.
* **poke:** Pokes a user.
* **punch:** Punches a user.
* **slap:** Slaps a user.
* **sleep:** Puts a user to sleep.
* **wake-up:** Wakes up a user.
* **wave:** Waves at a user.
* **wink:** Winks at a user.

### README Generators:

* **generate-commands:** Generates the commands list for Xiao's README. (Owner-Only)
* **generate-credit:** Generates the credit list for Xiao's README. (Owner-Only)
* **generate-process-env:** Generates a backup list of Xiao's `process.env`. (Owner-Only)

## Other Features

Some Xiao features aren't technically commands, but are part of Xiao
nonetheless.

- Leave messages are automatically sent to any channel that recieves welcome messages. These can be turned off with [an option](#options).
- In Xiao's home server, Xiao posts a random meme from Reddit every hour using a webhook.
- Some commands will automatically run when a certain phrase is said in any message, regardless of if the command itself was called or not. These are:
	* Saying "can you not" or "can u not" runs `can-you-not`.
	* Saying "Kazuma, Kazuma!" runs `kazuma-kazuma`.
	* Saying "no u" runs `no-u`.
	* Saying "kms", "kill myself", or using a custom emote named "kms" runs `suicide-hotline`.
	* Saying "(╯°□°）╯︵ ┻━┻" runs `unflip`.
	* Saying "r/subredditnamehere" runs `subreddit`. Obviously, replace "subbreditnamehere" with the name of the subreddit.
	* Starting a message with "clevs" or "cleverbot" runs `cleverbot` using the text after either word as the text.

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
- [20th Century Fox](https://www.foxmovies.com/)
	* bart-chalkboard ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
	* eat-pant ([Original "The Simpsons" Show](http://www.simpsonsworld.com/))
	* lisa-presentation ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
- [@Candasaurus](https://twitter.com/Candasaurus)
	* sora-selfie ([Image](https://twitter.com/Candasaurus/status/1041946636656599045))
- [@liltusk](https://twitter.com/liltusk)
	* food-broke ([Image](https://twitter.com/liltusk/status/835719948597137408))
- [Adorable Avatars](http://avatars.adorable.io/)
	* adorable (API)
- [Advice Slip](https://adviceslip.com/)
	* advice ([API](https://api.adviceslip.com/))
- [Alexey Star](https://alexeystar.com/)
	* hollywood-star ([Hollywood Star Font](https://alexeystar.com/hollywood-star-font/))
- [Alpha Vantage](https://www.alphavantage.co/)
	* stocks (API)
- [Ambition](https://ambition.com/)
	* horse-race ([Image](https://help.ambition.com/hc/en-us/articles/360005048011-How-do-I-set-up-a-Leaderboard-Slide-))
- [Andrew Tyler](https://www.dafont.com/andrew-tyler.d2526)
	* achievement ([Minecraftia Font](https://www.dafont.com/minecraftia.font))
- [AniList](https://anilist.co/)
	* anime ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* anime-airing ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* character ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
	* manga ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
- [Antonio Guillem](http://antonioguillem.com/)
	* distracted-boyfriend ([Image](https://www.istockphoto.com/photo/gm493656728-77018851))
- [Apple](https://www.apple.com/)
	* apple-engraving (API)
	* itunes ([iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/))
- [astrology.TV](https://astrology.tv/)
	* horoscope ([Horoscope Data](https://astrology.tv/horoscope/daily/))
- [Attype Studio](https://www.dafont.com/fadli-ramadhan-iskandar.d7339)
	* friendship ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
	* ship ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
- [Axis Order Bot](https://www.reddit.com/r/axisorderbot/wiki/index)
	* axis-cult (Prayer Data)
- [AZLyrics](https://www.azlyrics.com/)
	* lyrics (Lyrics Data)
- [Bob Ross](https://www.bobross.com/)
	* bob-ross (Himself)
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
- [cheesecakejedi](https://imgur.com/user/cheesecakejedi)
	* axis-cult-sign-up ([Image](https://imgur.com/gallery/quQTD))
- [Cheng Xiao](https://www.instagram.com/chengxiao_0715/)
	* certificate (Signature)
- [Christoph Mueller](https://www.fontsquirrel.com/fonts/list/foundry/christoph-mueller)
	* captcha ([Moms Typewriter Font](https://www.fontsquirrel.com/fonts/MomsTypewriter))
- [Chuck Norris](https://chucknorris.com/)
	* chuck-norris (Himself)
- [Clearbit](https://clearbit.com/)
	* company ([Autocomplete API](https://dashboard.clearbit.com/docs#autocomplete-api))
- [Cleverbot](https://www.cleverbot.com/)
	* cleverbot ([API](https://www.cleverbot.com/api/))
- [Clipart Library](http://clipart-library.com/)
	* hat ([Leprechaun Hat Image](http://clipart-library.com/clipart/1107361.htm))
	* rejected ([Image](http://clipart-library.com/clipart/Rejected-Stamp-Transparent.htm))
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
- [Danbooru](https://danbooru.donmai.us/)
	* danbooru (API)
- [Dance Dance Revolution](https://www.ddrgame.com/)
	* emoji-emoji-revolution (Concept)
- [Deathbulge](http://deathbulge.com/comics)
	* ultimate-tattoo ([Image](http://deathbulge.com/comics/114))
- [Derpibooru](https://derpibooru.org/)
	* derpibooru (API)
- [DeviantArt](https://www.deviantart.com/)
	* deviantart ([API](https://www.deviantart.com/developers/))
- [DeviantArt - xertris](https://www.deviantart.com/xertris)
	* hat ([Dunce Hat Image](https://www.deviantart.com/xertris/art/Dunce-Cap-634349483))
- [devsnek](https://github.com/devsnek)
	* owo (Code)
- [Discord Status Button](https://discord.c99.nl/)
	* status-button (API)
- [Disney](https://www.disney.com/)
	* beautiful ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
	* girl-worth-fighting-for ([Original "Mulan" Movie](https://movies.disney.com/mulan))
	* he-lives-in-you ([Image, Original "The Lion King" Movie](https://movies.disney.com/the-lion-king))
	* worthless ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
- [Dog CEO](https://dog.ceo/)
	* dog ([Dog API](https://dog.ceo/dog-api/))
- [Drake](https://drakeofficial.com/)
	* drakeposting ([Original "Hotline Bling" Music Video](https://youtu.be/uxpDa-c-4Mc))
- [Dust: An Elysian Tail](https://www.noogy.com/main.html)
	* fidget (Original Game)
- [DynamicPickaxe](http://dynamicpickaxe.com/)
	* hat ([Pirate Hat Image](http://dynamicpickaxe.com/pirate-hat-clipart.html))
- [ebearskittychan](https://twitter.com/ebearskittychan)
	* temmie (English-to-Temmie Dictionary Data)
- [Esther Verkest](https://www.facebook.com/Esther-Verkest-49667161749/)
	* sos (Image)
- [Face++ Cognitive Services](https://www.faceplusplus.com/)
	* face ([Face Detection API](https://www.faceplusplus.com/face-detection/))
- [FANDOM](https://www.fandom.com/)
	* superpower ([API](https://powerlisting.fandom.com/api.php))
	* wikia ([API](https://www.wikia.com/api/v1/))
- [Flickr](https://www.flickr.com/)
	* flickr ([API](https://www.flickr.com/services/api/))
- [Foreign exchange rates API](https://exchangeratesapi.io/)
	* currency (API)
- [Free SVG](https://freesvg.org/)
	* horse-race ([Image](https://freesvg.org/race-horse))
- [freeiconspng.com](https://www.freeiconspng.com/)
	* hat ([Birthday Hat Image](https://www.freeiconspng.com/img/43917))
- [Frinkiac](https://frinkiac.com/)
	* frinkiac (API)
- [Gallery Yopriceville](https://gallery.yopriceville.com/)
	* hat ([Pilgrim Hat Image](https://gallery.yopriceville.com/Free-Clipart-Pictures/Thanksgiving-PNG/Transparent_Brown_Pilgrim_Hat_PNG_Clipart))
- [gautamkrishnar](https://github.com/gautamkrishnar/)
	* be-like-bill ([Image](https://github.com/gautamkrishnar/Be-Like-Bill))
- [Gawdl3y](https://github.com/Gawdl3y)
	* rename-all (Concept)
- [Genderize.io](https://genderize.io/)
	* gender (API)
- [GIPHY](https://giphy.com/)
	* giphy ([API](https://developers.giphy.com/))
- [GitHub](https://github.com/)
	* changelog ([API](https://developer.github.com/v3/))
	* github ([API](https://developer.github.com/v3/))
	* github-zen ([Zen API](https://developer.github.com/v3/))
- [Go Nintendo](https://gonintendo.com/)
	* hat ([Ash Hat Image](https://gonintendo.com/stories/306292))
- [Google](https://www.google.com/)
	* book ([Books API](https://developers.google.com/books/))
	* calendar ([Calendar API](https://developers.google.com/calendar/))
	* dear-liberals ([Oswald Font](https://fonts.google.com/specimen/Oswald))
	* demotivational ([Noto Font](https://www.google.com/get/noto/))
	* google ([Custom Search API](https://cse.google.com/cse/all))
	* google-autofill (Autofill API)
	* google-doodle ([Google Doodles API](https://www.google.com/doodles))
	* google-feud (Autofill API)
	* gru-plan ([Noto Font](https://www.google.com/get/noto/))
	* lisa-presentation ([Noto Font](https://www.google.com/get/noto/))
	* map ([Maps Static API](https://developers.google.com/maps/documentation/maps-static/intro))
	* new-password ([Noto Font](https://www.google.com/get/noto/))
	* nike-ad ([Noto Font](https://www.google.com/get/noto/))
	* periodic-table ([Noto Font](https://www.google.com/get/noto/))
	* plankton-plan ([Noto Font](https://www.google.com/get/noto/))
	* sos ([Noto Font](https://www.google.com/get/noto/))
	* spongebob-burn ([Noto Font](https://www.google.com/get/noto/))
	* steam-card ([Noto Font](https://www.google.com/get/noto/))
	* steam-now-playing ([Noto Font](https://www.google.com/get/noto/))
	* steam-now-playing-classic ([Noto Font](https://www.google.com/get/noto/))
	* translate ([Google Translate](https://translate.google.com/))
	* youtube ([YouTube Data API](https://developers.google.com/youtube/v3/))
- [Google Feud](http://www.googlefeud.com/)
	* google-feud (Original Game)
- [goQR.me](http://goqr.me/)
	* create-qr-code ([QR code API](http://goqr.me/api/))
	* read-qr-code ([QR code API](http://goqr.me/api/))
- [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward)
	* hangman ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
	* word-chain ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
- [Gravatar](https://en.gravatar.com/)
	* gravatar ([API](https://en.gravatar.com/site/implement/))
- [Hasbro](https://shop.hasbro.com/en-us)
	* bro-hoof ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
	* brony-speak ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
	* connect-four (Original "Connect Four" Game)
	* scrabble-score ([Original Scrabble Game](https://scrabble.hasbro.com/en-us))
- [hbl917070](https://github.com/hbl917070)
	* axis-cult-sign-up ([Font](https://github.com/hbl917070/Konosuba-text))
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
- [iCrawl](https://github.com/iCrawl)
	* butt ([Code, Concept](https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/butts.js))
- [iFunny](https://ifunny.co/)
	* ifunny (Logo)
- [Illumination](http://www.illumination.com/)
	* gru-plan ([Original "Despicable Me" Movie](http://www.despicable.me/))
- [Imgur](https://imgur.com/)
	* blush ([API](https://apidocs.imgur.com/))
	* bro-hoof ([API](https://apidocs.imgur.com/))
	* eat ([API](https://apidocs.imgur.com/))
	* fidget ([API](https://apidocs.imgur.com/))
	* fist-bump ([API](https://apidocs.imgur.com/))
	* high-five ([API](https://apidocs.imgur.com/))
	* hold-hands ([API](https://apidocs.imgur.com/))
	* hug ([API](https://apidocs.imgur.com/))
	* imgur ([API](https://apidocs.imgur.com/))
	* karen ([API](https://apidocs.imgur.com/))
	* kill ([API](https://apidocs.imgur.com/))
	* kiss ([API](https://apidocs.imgur.com/))
	* lando ([API](https://apidocs.imgur.com/))
	* pat ([API](https://apidocs.imgur.com/))
	* poke ([API](https://apidocs.imgur.com/))
	* potato ([API](https://apidocs.imgur.com/))
	* punch ([API](https://apidocs.imgur.com/))
	* slap ([API](https://apidocs.imgur.com/))
	* sleep ([API](https://apidocs.imgur.com/))
	* wake-up ([API](https://apidocs.imgur.com/))
	* wave ([API](https://apidocs.imgur.com/))
	* wink ([API](https://apidocs.imgur.com/))
	* xiao ([API](https://apidocs.imgur.com/))
- [ipify API](https://www.ipify.org/)
	* ip (API)
- [Jack The Awesomeness Gamer](https://www.youtube.com/channel/UCIeA23B91hAeR1UuC2VDSdQ)
	* challenger ([Image](https://www.youtube.com/watch?v=3FebRrXg0bk))
- [Jackbox Games](https://www.jackboxgames.com/)
	* guesspionage ([Original "Guesspionage" Game](https://www.jackboxgames.com/guesspionage/))
- [jasmaa](https://github.com/jasmaa/)
	* neko-atsume-password ([API URL](https://github.com/jasmaa/nekoatsume-password-learner/blob/master/neko_pswd.py#L4))
- [JellyNeo Item Database](https://items.jellyneo.net/)
	* neopets-item (Item Data)
- [Jeopardy](https://www.jeopardy.com/)
	* jeopardy-question (Original Show)
- [Jessica Knable](https://picsart.com/u/jessicaknable)
	* hearts ([Image](https://picsart.com/i/sticker-hearts-heart-borders-frames-round-frame-border-love-263412201018212))
- [Jisho](https://jisho.org/)
	* jisho (API)
- [JoJo's Bizzare Adventure](http://www.araki-jojo.com/)
	* to-be-continued (Original Anime)
- [Jon Bernhardt](http://web.mit.edu/jonb/www/)
	* bart-chalkboard ([Akbar Font](https://www.wobblymusic.com/groening/akbar.html))
- [Kickstarter](https://www.kickstarter.com/)
	* kickstarter (API)
- [KINMOZA!](http://www.kinmosa.com/)
	* eggs-get-laid (Original Anime)
	* karen (Original Anime)
	* look-what-karen-have (Original Anime)
- [KissClipart.com](https://www.kissclipart.com/)
	* hat ([Witch Hat Image](https://www.kissclipart.com/halloween-witch-hat-clipart-witch-hat-clip-art-qfycyt/))
- [Know Your Meme](https://knowyourmeme.com/)
	* bob-ross ([Image](https://knowyourmeme.com/photos/1160348))
	* hat ([Christmas Hat Image](https://knowyourmeme.com/forums/just-for-fun/topics/24821-christmas-hat-thread))
	* know-your-meme (Meme Data)
	* kyon-gun ([Image](https://knowyourmeme.com/photos/217992-endless-eight-kyon-kun-denwa))
	* look-what-karen-have ([Image](https://knowyourmeme.com/photos/1047091-kin-iro-mosaic-kinmoza))
- [Konami](https://www.konami.com/en/)
	* yu-gi-oh ([Original "Yu-Gi-Oh!" Game](https://www.yugioh-card.com/en/))
	* yu-gi-oh-token ([Image, Original "Yu-Gi-Oh!" Game](https://www.yugioh-card.com/en/))
- [KONOSUBA -God's blessing on this wonderful world!](http://konosuba.com/)
	* axis-cult (Original Anime)
	* axis-cult-sign-up (Original Anime)
	* hat (Megumin Hat Original Anime)
	* kazuma-kazuma (Original Anime)
- [Latlmes](https://www.latlmes.com/)
	* latlmes (API)
- [LMGTFY](https://lmgtfy.com/)
	* google (API)
	* lmgtfy (API)
- [LN cover generator](https://salty-salty-studios.com/shiz/lncovers.php)
	* light-novel-cover (API)
- [LN title generator](https://salty-salty-studios.com/shiz/ln.php)
	* light-novel-title (API)
- [LoveToKnow](https://www.lovetoknow.com/)
	* horse-race ([Horse Name Data](https://horses.lovetoknow.com/horse-names/funny-horse-names))
- [Mad Libs](http://www.madlibs.com/)
	* mad-libs (Original Game)
- [Mad:)Takes](https://www.madtakes.com/index.php)
	* mad-libs (Mad Libs Data)
- [MangaGamer.com](https://www.mangagamer.com/)
	* box-choosing ([Original Translation](https://store.steampowered.com/app/526490/Higurashi_When_They_Cry_Hou__Ch4_Himatsubushi/))
- [Marvelous](http://www.marv.jp/)
	* give-flower ([Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
	* xiao ([Images, Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
- [mathjs](https://mathjs.org/)
	* math (Expression Parser)
	* units (Expression Parser)
- [Mattel](https://www.mattel.com/en-us)
	* 8-ball ([Original Concept](https://www.mattelgames.com/games/en-us/kids/magic-8-ball))
	* i-have-the-power (Image, Original "He-Man" Show)
- [Mayo Clinic](https://www.mayoclinic.org/)
	* mayo-clinic (Disease Data)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
	* mdn (API)
- [Merriam-Webster's Collegiate® Dictionary](https://www.merriam-webster.com/)
	* define ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
	* hangman ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
- [mikewesthad](https://github.com/mikewesthad)
	* pirate ([English-to-Pirate Dictionary Data](https://github.com/mikewesthad/pirate-speak/blob/master/lib/pirate-speak.js#L1-L155))
- [Minecraft Achievement Generator](https://www.minecraftskinstealer.com/achievement/)
	* achievement (Image)
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
- [muffinlabs - Today in History](http://history.muffinlabs.com/)
	* today-in-history ([API](http://history.muffinlabs.com/#api))
- [MyAnimeList](https://myanimelist.net/)
	* anime (Score Data)
	* manga (Score Data)
- [Mythbusters](https://go.discovery.com/tv-shows/mythbusters)
	* doors (Concept)
- [NASA](https://www.nasa.gov/)
	* apod ([APOD API](https://api.nasa.gov/))
	* gravity ([Planet Gravity Data](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html))
	* nasa ([NASA Image and Video Library API](https://api.nasa.gov/))
- [National Suicide Prevention Lifeline](https://suicidepreventionlifeline.org/)
	* suicide-hotline (Phone Number)
- [Neko Atsume: Kitty Collector](http://nekoatsume.com/en/)
	* neko-atsume-password (API, Original Game)
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
- [Nike](https://www.nike.com/)
	* nike-ad (Logo, Concept)
- [Nintendo](https://www.nintendo.com/)
	* challenger ([Original "Super Smash Bros." Game](https://www.smashbros.com/en_US/index.html))
	* smw-level ([Original "Super Mario World" Game](https://www.nintendo.co.jp/n02/shvc/mw/index.html))
- [NotAWeebDev](https://github.com/NotAWeebDev/)
	* triggered ([Image](https://github.com/NotAWeebDev/Misaki/blob/2e44f9efb467028dcbae5a2c9f836d2e99860b85/assets/images/plate_triggered.png))
- [npm](https://www.npmjs.com/)
	* npm (API)
- [Numbers API](http://numbersapi.com/)
	* number-fact (Trivia API)
- [Open Notify](http://open-notify.org/)
	* iss ([ISS Current Location API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/))
	* people-in-space ([People in Space API](http://open-notify.org/Open-Notify-API/People-In-Space/))
- [Open Trivia DB](https://opentdb.com/)
	* quiz ([API](https://opentdb.com/api_config.php))
	* quiz-duel ([API](https://opentdb.com/api_config.php))
- [OpenWeatherMap](https://openweathermap.org/)
	* weather ([API](https://openweathermap.org/api))
- [OPTIFONT](http://opti.netii.net/)
	* jeopardy-question ([Korinna Agency Font](https://fontmeme.com/fonts/korinna-agency-font/))
- [osu!](https://osu.ppy.sh/home)
	* osu ([API](https://github.com/ppy/osu-api/wiki))
- [PAC-MAN Party](http://pacman.com/en/pac-man-games/pac-man-party)
	* balloon-pop (Concept)
- [PayPal](https://www.paypal.com/us/home)
	* donate (Donation Gathering)
- [Perspective API](https://www.perspectiveapi.com/#/)
	* severe-toxicity (API)
	* toxicity (API)
- [Playstation Trophies](https://www.playstationtrophies.org/)
	* guesspionage ([Question Data](https://www.playstationtrophies.org/game/the-jackbox-party-pack-3/trophy/157520-Guesspionage--Perfect-Surveillance.html))
- [PNG Arts](https://www.pngarts.com/)
	* police-tape ([Image](https://www.pngarts.com/explore/94078))
- [pngimg.com](https://pngimg.com/)
	* thug-life ([Image](http://pngimg.com/download/58231))
- [Platinum Designz](http://store.platinumdesignz.com/)
	* glass-shatter ([Image]('https://www.jing.fm/iclipt/u2q8u2a9o0t4i1q8/))
- [Pokemon Fusion](https://pokemon.alexonsager.net/)
	* pokemon-fusion (Images)
- [PokéAPI](https://pokeapi.co/)
	* pokedex (API)
	* whos-that-pokemon (API)
- [Pokémon](https://www.pokemon.com/us/)
	* 3000-years (Image, Original Game)
	* dexter (Image, Original Anime)
	* hat (Ash Hat Original Anime)
	* pokedex (Images, Original Game)
	* pokemon-fusion (Original Game)
	* whos-that-pokemon (Images, Original Game)
	* wynaut (Image, Original Anime)
- [Pottermore](https://my.pottermore.com/sorting)
	* sorting-hat (Original Quiz)
- [PSYCHO-PASS](http://psycho-pass.com/)
	* psycho-pass (Original Anime)
- [Psycho-Pass Wiki](https://psychopass.fandom.com/wiki/Psycho-Pass_Wiki)
	* psycho-pass ([Crime Coefficient Levels Data](https://psychopass.fandom.com/wiki/Crime_Coefficient_(Index%27))
- [r/IsTodayFridayThe13th](https://www.reddit.com/r/IsTodayFridayThe13th/)
	* friday-the-13th (Concept)
- [r/Showerthoughts](https://www.reddit.com/r/showerthoughts)
	* shower-thought (Shower Thought Data)
- [Random-d.uk](https://random-d.uk/)
	* duck ([API](https://random-d.uk/api))
	* http-duck ([API](https://random-d.uk/http))
- [random.cat](https://random.cat/)
	* cat (API)
- [RandomFox](https://randomfox.ca/)
	* fox (API)
- [Recipe Puppy](http://www.recipepuppy.com/)
	* recipe ([API](http://www.recipepuppy.com/about/api/))
- [RedBubble - Akbar Mna](https://www.redbubble.com/en/people/akbarmna/shop)
	* hat ([Megumin Hat Image](https://www.redbubble.com/people/akbarmna/works/25443591-megumins-hat-minimalistic?p=poster))
- [Reddit](https://www.reddit.com/)
	* meme ([API](https://www.reddit.com/dev/api/))
	* reddit ([API](https://www.reddit.com/dev/api/))
	* shower-thought ([API](https://www.reddit.com/dev/api/))
	* subreddit ([API](https://www.reddit.com/dev/api/))
- [Redeeming God](https://redeeminggod.com/)
	* approved ([Image](https://redeeminggod.com/courses/gospel-dictionary/lessons/gospel-dictionary-approved/))
- [RedKid.Net](http://www.redkid.net/)
	* hollywood-star ([Image](http://www.redkid.net/generator/star/))
- [Rest Countries](https://restcountries.eu/)
	* country (API)
- [Right Stuf Anime](https://www.rightstufanime.com/)
	* right-stuf (API)
- [Riot Games](https://www.riotgames.com/en)
	* league-of-legends ([API](https://developer.riotgames.com/))
- [RoboHash](https://robohash.org/)
	* robohash (API)
- [RogerHub Final Grade Calculator](https://rogerhub.com/final-grade-calculator/)
	* final-grade (Concept, Code)
- [Rotten Tomatoes](https://www.rottentomatoes.com/)
	* rotten-tomatoes (API)
- [Safebooru](https://safebooru.org/)
	* safebooru (API)
- [Serebii.net](https://www.serebii.net/index2.shtml)
	* pokedex (Images)
	* whos-that-pokemon (Images)
- [ShareFonts.net](https://www.wfonts.com/)
	* meme-gen ([Impact Font](https://www.wfonts.com/font/impact))
- [shibe.online](https://shibe.online/)
	* bird (API)
	* shiba (API)
- [Shields.io](https://shields.io/)
	* shields-io-badge (API)
- [Shrick](https://www.deviantart.com/shrick)
	* brony-speak ([English-to-Brony Dictionary Data](https://www.deviantart.com/shrick/art/Brony-dictionary-version-2-207157029))
- [SinKillerJ Tachikawa](https://www.deviantart.com/sinkillerj)
	* steam-card ([Template](https://www.deviantart.com/sinkillerj/art/Steam-Trading-Card-Template-GIMP-372156984))
- [SMWiki](http://www.smwiki.net/)
	* smw-level ([Level Name Data](http://old.smwiki.net/wiki/List_of_Super_Mario_World_levels))
- [SoundCloud](https://soundcloud.com/)
	* soundcloud ([API](https://developers.soundcloud.com/))
- [SPAM Brand](https://www.spam.com/)
	* spam (Image)
- [speak lolcat](https://speaklolcat.com/)
	* lolcat (Translation Data)
- [Square Enix](https://square-enix-games.com/)
	* nobody-name ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
	* sora-selfie ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
- [Stack Exchange](https://stackexchange.com/)
	* stack-overflow ([API](https://api.stackexchange.com/docs))
- [Stadium Talk](https://www.stadiumtalk.com/)
	* horse-race ([Horse Name Data](https://www.stadiumtalk.com/s/best-racehorse-names-be7b8ad6b49a42df))
- [Star Wars](https://www.starwars.com/)
	* lando (Original Movie)
- [Steam](https://store.steampowered.com/)
	* steam (API)
	* steam-card ([Original Design](https://steamcommunity.com/tradingcards/))
	* steam-now-playing (Original Design)
	* steam-now-playing-classic (Original Design)
- [Straw Poll](https://www.strawpoll.me/)
	* strawpoll ([API](https://github.com/strawpoll/strawpoll/wiki/API))
- [Superpower Wiki](https://powerlisting.fandom.com/wiki/Superpower_Wiki)
	* superpower (Superpower Data)
- [susi1959](https://en.picmix.com/profile/susi1959)
	* fire ([Image](https://en.picmix.com/stamp/FIRE-FRAME-ORANGE-cadre-feu-orange-360274))
- [Tatsumaki](https://tatsumaki.xyz/)
	* beautiful (Image, Concept)
	* fishy (Concept)
	* phone (Concept)
	* psycho-pass (Concept)
- [Tenor](https://tenor.com/)
	* tenor ([API](https://tenor.com/gifapi/documentation))
- [The Internet Chuck Norris Database](http://www.icndb.com/)
	* chuck-norris ([API](http://www.icndb.com/api/))
- [The Melancholy of Haruhi Suzumiya](http://www.haruhi.tv/)
	* kyon-gun (Original Anime)
- [The Movie Database](https://www.themoviedb.org/)
	* movie ([API](https://www.themoviedb.org/documentation/api))
	* tv-show ([API](https://www.themoviedb.org/documentation/api))
- [The Newspaper Clipping Generator](https://www.fodey.com/generators/newspaper/snippet.asp)
	* newspaper (API)
- [The Yoda-Speak Generator](https://www.yodaspeak.co.uk/)
	* yoda (API)
- [This Waifu Does Not Exist](https://www.thiswaifudoesnotexist.net/)
	* waifu (API)
- [Tim's Printables](https://www.timvandevall.com/)
	* wanted ([Image](https://www.pinterest.com/pin/365002744774849370/))
- [TrueAchievements](https://www.trueachievements.com/)
	* guesspionage ([Question Data](https://www.trueachievements.com/forum/viewthread.aspx?tid=850920))
- [Tumblr](https://www.tumblr.com/)
	* tumblr ([API](https://www.tumblr.com/docs/en/api/v2))
- [Turning Point USA](https://www.tpusa.com/)
	* dear-liberals (Image)
- [Twitter](https://twitter.com/)
	* twitter ([API](https://developer.twitter.com/en/docs.html))
- [u/_Ebb](https://www.reddit.com/user/_Ebb)
	* eat-pant ([Image](https://www.reddit.com/r/Ooer/comments/52z589/eat_pant_maaaaaaaan/))
- [u/AelinSA](https://www.reddit.com/user/AelinSA)
	* dark-light ([Image](https://www.reddit.com/r/discordapp/comments/9krnhr/preach_the_message_of_the_möth_with_this_magi))
- [u/LennyMcLennington](https://www.reddit.com/user/LennyMcLennington)
	* dark-light ([Image](https://www.reddit.com/r/discordapp/comments/8t04ag/this_image_shows_different_text_depending_on/))
- [u/N1ffler](https://www.reddit.com/user/N1ffler/)
	* sorting-hat ([Sorting Hat Quiz Analysis Data](https://www.reddit.com/r/Pottermore/comments/44os14/pottermore_sorting_hat_quiz_analysis/))
- [u/SupremeMemesXD](https://www.reddit.com/user/SupremeMemesXD/)
	* girl-worth-fighting-for ([Image](https://www.reddit.com/r/MemeTemplatesOfficial/comments/8h39vi/girl_worth_fighting_for_template/))
- [UNDERTALE](https://undertale.com/)
	* temmie (Original Game)
- [Urban Dictionary](https://www.urbandictionary.com/)
	* urban ([API](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation))
- [USPS](https://www.usps.com/)
	* usps-tracking ([API](https://www.usps.com/business/web-tools-apis/))
- [Valve](https://www.valvesoftware.com/en/)
	* fact-core ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
	* oracle-turret ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
- [vician](https://www.123rf.com/profile_vician)
	* rip ([Image](https://www.123rf.com/profile_vician?mediapopup=13181623))
- [VocaDB](https://vocadb.net/)
	* vocadb ([API](https://vocadb.net/swagger/ui/index))
- [Wait, what does your startup do?](http://itsthisforthat.com/)
	* this-for-that ([API](http://itsthisforthat.com/api.php))
- [WAIT: What Anime Is This?](https://trace.moe/)
	* what-anime ([API](https://soruly.github.io/trace.moe/#/))
- [Wattpad](https://www.wattpad.com/)
	* wattpad ([API](https://www.wattpad.com/developer/docs/api))
- [wikiHow](https://www.wikihow.com/Main-Page)
	* wikihow ([API](https://www.wikihow.com/api.php))
- [Wikipedia](https://www.wikipedia.org/)
	* fact ([API](https://en.wikipedia.org/w/api.php))
	* idiot (URL)
	* itunes ([Language Code Data](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes))
	* time ([Time Zone Data](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
	* wikipedia ([API](https://en.wikipedia.org/w/api.php))
- [www.aljanh.net](http://www.aljanh.net/)
	* frame ([Image](http://www.aljanh.net/frame-wallpapers/1508614706.html))
- [xkcd](https://xkcd.com/)
	* xkcd ([API](https://xkcd.com/json.html))
- [Yahoo](https://www.yahoo.com/)
	* stocks (Finance API)
- [YGOPRODECK](https://ygoprodeck.com/)
	* yu-gi-oh ([API](https://db.ygoprodeck.com/api-guide/))
- [YorkAARGH](https://github.com/YorkAARGH)
	* ultimate-tattoo (Concept)
