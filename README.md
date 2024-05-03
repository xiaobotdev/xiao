## Agreement

Just read `LICENSE.md`. Give credit if you use any part of this monster, thanks.

## FAQ

> Will Xiao ever be public again?

No.

> Will Xiao ever support Slash Commands?

Most likely, no. Many of the commands in Xiao were written with the message content intent in mind,
and given her status as a private bot I see no reason to change that. Plus, kitchen-sink bots
really _don't_ work with Slash Commands, they just clog up the list.

> Can I use part of Xiao's code (i.e. a command) in my bot?

I don't really care, but please give credit in some form if you do so. You'll also be subject to
`LICENSE.md`, and I won't provide you with any support if it doesn't work.

> Can I host Xiao myself?

If you want, good luck. Setting her up is a pretty difficult task.

> Do I need every API key, emoji ID, etc.?

No, but some commands may not work without them.

> Do I need to set up Redis?

Yes, several commands and functions rely on it.

> Do I really need to install Wine and Wine32 on Linux?

Only if you want to use the DECTalk command.

> Where can I find DECTalk?

Good question! I don't even remember where I found it, and I really can't help you. While it's
probably considered abandonware and I doubt anyone would go after a private Discord bot of all
things, I'm not taking any chances.

## Installing

### Filling Out `.env`
#### Discord-related info
* `XIAO_TOKEN` is the token of your bot. You can get this at the [Discord Developer Portal](https://discord.com/developers/applications).
* `OWNERS` is the Discord user IDs of users you want to have access to sensitive commands. Be careful putting anyone but yourself here.
* `LOVER_USER_ID` is the Discord user ID of your significant other. This rigs certain commands, like `ship`. Optional for loners.
* `XIAO_PREFIX` is the prefix the bot should have.
* `INVITE` is an invite link for the bot's support server. Optional.
* `REPORT_CHANNEL_ID` is a channel ID for the bot to send reports to. Optional, by default it'll send the owners a DM.
* `JOIN_LEAVE_CHANNEL_ID` is a channel ID for the bot to send server join/leave information to. Optional.

#### Redis info
* `REDIS_HOST` is the hostname of your Redis server. If unsure, it's probably `localhost`.
* `REDIS_PASS` is the password to your Redis server.

#### Emojis IDs
* `SUCCESS_EMOJI_ID` is an emoji ID for when things succeed. Defaults to "✅".
* `FAILURE_EMOJI_ID` is an emoji ID for when things fail. Defaults to "❌".
* `LOADING_EMOJI_ID` is an emoji ID for when things are loading. Defaults to "💬".
* `GOLD_FISH_EMOJI_ID` and `GOLD_FISH_EMOJI_NAME` are for **neko-atsume-password**. Defaults to "Gold Fish".
* `SILVER_FISH_EMOJI_ID` and `SILVER_FISH_EMOJI_NAME` are for **neko-atsume-password**. Defaults to "Silver Fish".
* `MOCKING_EMOJI_ID` and `MOCKING_EMOJI_NAME` are for **mocking**. Defaults to nothing, it just won't be there.
* `PORTAL_EMOJI_ID` and `PORTAL_EMOJI_NAME` are for **portal-send**. Defaults to "PORTAL".
* `MEGA_EVOLVE_EMOJI_ID` and `MEGA_EVOLVE_EMOJI_NAME` are for **pokedex**. Defaults to "MEGA".
* `NAME_RATER_EMOJI_ID` and `NAME_RATER_EMOJI_NAME` are for **name-rater**. Defaults to nothing, it just won't be there.

#### API Keys, IDs, and Secrets
* `ANILIST_USERNAME` is your username for [Anilist](https://anilist.co/home). Optional, defaults to "dragonfire535".
* `BITLY_KEY` is your API key for Bit.ly. You can get one [here](https://dev.bitly.com/docs/getting-started/authentication/).
* `CLEVERBOT_KEY` is your API key for Cleverbot. You can get one [here](https://www.cleverbot.com/api/).
* `GITHUB_ACCESS_TOKEN` is your access token for GitHub. [Follow these steps](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) to make one.
* `GOOGLE_KEY` is your API key for Google, used for the YouTube Data API. You can get one [here](https://console.cloud.google.com/apis/dashboard). You must also [activate the YouTube Data API](https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com?q=search).
* `GOV_KEY` is your API key for NASA. You get get one [here](https://api.nasa.gov/).
* `SAUCENAO_KEY` is your API key for SauceNAO. Register, login, and click [here](https://saucenao.com/user.php?page=search-api) to get one.
* `SPOTIFY_KEY` and `SPOTIFY_SECRET` are your key and secret for the Spotify API. You can get one by [following these instructions](https://developer.spotify.com/documentation/web-api).
* `THECATAPI_KEY` is your API key for The Cat API. You can get one [here](https://thecatapi.com/).
* `THEDOGAPI_KEY` is your API key for The Dog API. You can get one [here](https://thedogapi.com/).
* `WEBSTER_KEY` is your API key for Merriam-Webster. You can get one [here](https://dictionaryapi.com/).
* `XIAO_GITHUB_REPO_NAME` and `XIAO_GITHUB_REPO_USERNAME` are the name and username of the GitHub repo where Xiao lives. These are optional, and default to "xiao" and "dragonfire535" respectively.

### Run (Linux)

> Install instructions below are for Linux. She should work on Windows, but I can't guarantee anything.

1. Install [Node.js](https://nodejs.org/en/).
2. Run `apt install git` to install git.
3. Clone this repository with `git clone https://github.com/dragonfire535/xiao.git`.
4. Run `cd xiao` to move into the folder that you just created.
5. Create a file named `.env` and fill it out as shown in above and in `.env.example`.
6. Run `apt update` and `apt upgrade` to install the latest dependencies of your distro.
7. Run `apt install ffmpeg` to install ffmpeg.
8. Run `apt install liblqr-1-0-dev liblqr-1-0` to install liblqr (needed for ImageMagick).
9. [Follow these instructions to install ImageMagick](https://www.tecmint.com/install-imagemagick-on-debian-ubuntu/).
10. [Follow these instructions to set up Redis](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). Remember to set up a password!
11. Run `apt install libtool` so sodium can compile if necessary. **(Optional)**
12. Download [the NSFW model](https://github.com/gantman/nsfw_model) and extract the contents to `<xiao folder>/tf_models/nsfw`.
13. Download DECTalk and extract `dectalk.dll`, `dtalk_us.dic`, `MSVCRTd.DLL`, and `say.exe` to `dectalk/`. I cannot help you find this.
14. Run `apt install wine` to install wine.
15. Run `dpkg --add-architecture i386` to allow installation of wine32.
16. Run `apt update` again.
17. Run `apt install wine32` to install wine32.
18. Run `apt install xvfb` to install xvfb.
19. Run `yarn install --production` in the folder you cloned the bot.
20. Run `npx parse-domain-update` to update the domain list for `parse-domain`.
21. Start Xiao up!

## Commands
Total: 510

### Utility:

* **changelog:** Responds with the bot's latest 10 commits.
* **cloc:** Responds with the bot's code line count.
* **command-leaderboard:** Responds with the bot's most used commands.
* **credit:** Responds with a command's credits list.
* **group-leaderboard:** Responds with the bot's most used command groups.
* **help:** Displays a list of available commands, or detailed information for a specific command.
* **high-scores:** Responds with the high scores the bot has saved.
* **info:** Responds with detailed bot information.
* **last-run:** Responds with a command's most recent run date.
* **last-run-leaderboard:** Responds with the bot's most recently run commands.
* **options:** Responds with a list of server options.
* **ping:** Checks the bot's ping to the Discord server.
* **report:** Reports something to the bot owner(s).
* **unknown-command:** Displays help information for when an unknown command is used.
* **uses:** Responds with a command's usage stats.

### Utility (Voice):

* **join:** Joins your voice channel.
* **leave:** Leaves the current voice channel.
* **pause:** Pauses the current audio playing.
* **resume:** Resume the current audio playing.
* **stop:** Stops the current audio playing.

### Discord Information:

* **avatar:** Responds with a user's avatar.
* **emoji-image:** Responds with an emoji's full-scale image.
* **emoji-zip:** Responds with a ZIP file of the server's custom emoji.
* **first-message:** Responds with the first message ever sent to a channel.
* **server-icon:** Responds with the server's icon.

### Random Response:

* **8-ball:** Asks your question to the Magic 8 Ball.
* **acrostic:** Creates an acrostic from any word or name.
* **advice:** Responds with a random bit of advice.
* **affirmation:** Responds with a random affirmation.
* **axis-cult:** Responds with a teaching of the Axis Cult.
* **boredom:** Responds with a random activity to try when you're bored.
* **choose:** Chooses between options you provide.
* **chuck-norris:** Responds with a random Chuck Norris joke.
* **coin:** Flips a coin.
* **compliment:** Compliments a user.
* **draw-cards:** Draws a random hand of playing cards.
* **fact:** Responds with a random fact.
* **fact-core:** Responds with a random Fact Core quote.
* **fake-poll:** Randomly polls a bunch of fake users for their opinion on a yes/no question.
* **fml:** Responds with a FML quote. (NSFW)
* **fortune:** Responds with a random fortune.
* **github-zen:** Responds with a random GitHub design philosophy.
* **incorrect-quote:** Generates an incorrect quote.
* **joke:** Responds with a random joke.
* **kiss-marry-kill:** Determines who to kiss, who to marry, and who to kill.
* **light-novel-title:** Responds with a randomly generated Light Novel title.
* **lorem-ipsum:** Generates a randomized Lorem Ipsum placeholder text.
* **magic-conch:** Asks your question to the Magic Conch.
* **name:** Responds with a random name, with the gender of your choice.
* **never-have-i-ever:** Responds with a random "Never Have I Ever..." statement.
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
* **smw-level:** Responds with a random Super Mario World level name.
* **suggest-command:** Suggests a random command for you to try.
* **superpower:** Responds with a random superpower.
* **word:** Responds with a random word.
* **xiao-fact:** Responds with a random fact about Xiao.
* **yes-no:** Answers a yes/no question randomly.
* **yo-mama:** Responds with a random "Yo Mama" joke.

### Random Image:

* **bird:** Responds with a random image of a bird.
* **bunny:** Responds with a random bunny image and fact.
* **cat:** Responds with a random cat image and fact.
* **dog:** Responds with a random dog image and fact.
* **duck:** Responds with a random duck image.
* **fox:** Responds with a random fox image.
* **frog:** Responds with a random frog image.
* **goose:** Responds with a random goose image.
* **inspiration:** Responds with a randomly generated inspiration.
* **light-novel-cover:** Responds with a randomly generated Light Novel cover. (NSFW)
* **lizard:** Responds with a random lizard image.
* **lorem-picsum:** Responds with a random image of a certain size.
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
* **think-of:** Determines what a user thinks of another user.
* **worth:** Determines how much a user is worth.

### Single Response:

* **cave:** Sends a Minecraft cave that blends in with the chat.
* **dark-light:** Determines whether you use dark or light theme.
* **eat-pant:** Eat pant.
* **eggs-get-laid:** Sends the ultimate roast.
* **fly:** Sends a fake fly that looks surprisngly real.
* **give-flower:** Gives Xiao Pai a flower.
* **hello-world:** Hello world!
* **hi:** Hello.
* **rickroll:** Sends a link to the "Never Gonna Give You Up" music video.
* **tableflip:** Flips a table... With animation!
* **where-is-everybody:** Where is everybody?
* **yoff:** Posts a picture that truly defines modern art.

### Automatic Response:

* **can-you-not:** Can YOU not?
* **unflip:** Unflips a table.

### Events:

* **anime-airing:** Responds with a list of the anime that air today.
* **apod:** Responds with today's Astronomy Picture of the Day.
* **calendar:** Responds with the calendar for a specific month and year.
* **days-since:** Responds with how many days there have been since a certain date.
* **days-until:** Responds with how many days there are until a certain date.
* **florida-man:** Responds with the Flordia man of the day.
* **google-doodle:** Responds with a Google Doodle, either the latest one or a random one from the past.
* **horoscope:** Responds with today's horoscope for a specific Zodiac sign.
* **is-leap:** Responds with if a year is a leap year.
* **is-tuesday:** Determines if today is Tuesday.
* **neko-atsume-password:** Responds with today's Neko Atsume password.
* **time:** Responds with the current time in a particular location.
* **today-in-history:** Responds with an event that occurred today in history.
* **us-election:** Responds with the odds of each canidate winning the presidential election.
* **word-of-the-day:** Responds with today's word of the day.
* **year-progress:** Responds with the progress of the current year.

### Search:

* **anilist:** Responds with user information for an Anilist user.
* **anime:** Searches AniList for your query, getting anime results.
* **anime-character:** Searches AniList for your query, getting character results.
* **anime-staff:** Searches AniList for your query, getting staff results.
* **define:** Defines a word.
* **frinkiac:** Input a line from the Simpsons to get the episode/season.
* **github:** Responds with information on a GitHub repository.
* **google-autofill:** Responds with a list of the Google Autofill results for a particular query.
* **gravatar:** Responds with the Gravatar for an email.
* **http-cat:** Responds with a cat for an HTTP status code.
* **know-your-meme:** Searches Know Your Meme for your query.
* **lorcana:** Responds with info on a Lorcana card.
* **magic:** Responds with info on a Magic: The Gathering card.
* **manga:** Searches AniList for your query, getting manga results.
* **nasa:** Searches NASA's image archive for your query.
* **neopet:** Responds with the image of a specific Neopet.
* **neopets-item:** Responds with information on a specific Neopets item.
* **npm:** Responds with information on an NPM package.
* **periodic-table:** Finds an element on the periodic table.
* **rule:** Responds with a rule of the internet.
* **urban:** Defines a word, but with Urban Dictionary.
* **wikipedia:** Searches Wikipedia for your query.
* **xkcd:** Responds with an XKCD comic, either today's, a random one, or a specific one.
* **yu-gi-oh:** Responds with info on a Yu-Gi-Oh! card.

### Pokédex:

* **pokedex:** Searches the Pokédex for a Pokémon.
* **pokedex-ability:** Searches the Pokédex for a Pokémon ability.
* **pokedex-box-sprite:** Responds with the box sprite of a Pokémon.
* **pokedex-cry:** Plays a Pokémon's cry.
* **pokedex-image:** Responds with the image of a Pokémon.
* **pokedex-item:** Searches the Pokédex for a Pokémon item.
* **pokedex-location:** Responds with the location data for a Pokémon.
* **pokedex-move:** Searches the Pokédex for a Pokémon move.
* **pokedex-moveset:** Responds with the moveset for a Pokémon.
* **pokedex-stats:** Responds with the stats for a Pokémon.
* **smogon:** Responds with the Smogon tiers for a Pokémon.

### Analyzers:

* **age:** Responds with how old someone born in a certain year is.
* **aspect-ratio:** Determines an image's aspect ratio.
* **birthstone:** Responds with the Birthstone for a month.
* **character-count:** Responds with the character count of text.
* **chinese-zodiac:** Responds with the Chinese Zodiac Sign for the given year.
* **dominant-color:** Determines the dominant color of an image.
* **faces:** Shows all detected faces in an image.
* **gender:** Determines the gender of a name.
* **generation:** Responds with the Generation for the given year.
* **image-size:** Determines the size of an image.
* **is-it-down:** Determines if a website is down or not.
* **levenshtein:** Determines the levenshtein distance between two strings.
* **nsfw-image:** Determines if an image is NSFW.
* **nsfw-url:** Determines if a URL is NSFW.
* **parse-time:** Analyzes the time duration you provide and gives the result.
* **read-qr-code:** Reads a QR Code.
* **scrabble-score:** Responds with the scrabble score of a word.
* **screenshot:** Takes a screenshot of any webpage.
* **text-diff:** Compares two different bits of text.
* **valid-url:** Tests whether a URL is valid or not.
* **zodiac-sign:** Responds with the Zodiac Sign for the given month/day.

### Single-Player Games:

* **20-questions:** Think of something and 20Q will read your mind by asking a few simple questions.
* **akinator:** Think about a real or fictional character, I will try to guess who it is.
* **anagramica:** Try to find all the anagrams for a given set of letters.
* **anime-score:** See if you can guess what a random anime's score is.
* **antidepressant-or-tolkien:** See if you can guess if a word is an Antidepressant or Tolkien character.
* **blackjack:** Play a game of blackjack.
* **box-choosing:** Do you believe that there are choices in life? Taken from Higurashi Chapter 4.
* **bubble-wrap:** Pop some bubble wrap.
* **captcha:** Try to guess what the captcha says.
* **chance:** Attempt to win with a 1 in 1000 (or your choice) chance of winning.
* **doors:** Open the right door, and you win the money! Make the wrong choice, and you get the fire!
* **google-feud:** Attempt to determine the top suggestions for a Google search.
* **guess-song:** Guess what song is playing.
* **hangman:** Prevent a man from being hanged by guessing a word as fast as you can.
* **hearing-test:** Test your hearing.
* **horse-info:** Responds with detailed information on a horse.
* **horse-race:** Bet on the fastest horse in a 6-horse race.
* **hunger-games:** Simulate a Hunger Games match with up to 24 tributes.
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
* **tarot:** Provides a fortune using Tarot cards.
* **the-game:** If you think about the game, you lose.
* **true-or-false:** Answer a true or false question.
* **typing-test:** See how fast you can type a sentence.
* **whos-that-pokemon:** Guess who that Pokémon is, based on their silhouette.
* **whos-that-pokemon-cry:** Guess who that Pokémon is, based on their cry.
* **would-you-rather:** Responds with a random "Would you rather ...?" question.

### Multi-Player Games:

* **apples-to-apples:** Compete to see who can come up with the best card to match an adjective.
* **balloon-pop:** Don't let yourself be the last one to pump the balloon before it pops!
* **battle:** Engage in a turn-based battle against another user or the AI.
* **bingo:** Play bingo with up to 99 other users.
* **car-race:** Race a car against another user or the AI.
* **cards-against-humanity:** Compete to see who can come up with the best card to fill in the blank. (NSFW)
* **chess:** Play a game of Chess with another user or the AI.
* **chess-delete:** Deletes your saved Chess game.
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
* **mafia:** Who is the Mafia? Who is the detective? Will the Mafia kill them all?
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

### Face Manipulation:

* **anime-eyes:** Draws anime eyes onto the faces in an image.
* **danny-devito:** Draws Danny Devito's face onto the faces in an image.
* **emoji-face:** Draws an emoji onto the faces in an image.
* **eyes:** Draws emoji eyes onto the faces in an image.
* **shrek:** Draws Shrek's face onto the faces in an image.

### Image Manipulation:

* **analog-clock:** Draws an analog clock for a timezone.
* **approved:** Draws an "approved" stamp over an image or a user's avatar.
* **ascii:** Draws an image or a user's avatar but with ascii.
* **blur:** Draws an image or a user's avatar but blurred.
* **bob-ross:** Draws an image or a user's avatar over Bob Ross' canvas.
* **brazzers:** Draws an image with the Brazzers logo in the corner. (NSFW)
* **charcoal:** Draws an image or a user's avatar but with charcoal.
* **chocolate-milk:** Draws an image or user's avatar holding chocolate milk.
* **circle:** Draws an image or a user's avatar as a circle.
* **color:** Sends an image of the color you choose.
* **communist:** Draws the Communist flag over an image or a user's avatar.
* **contrast:** Draws an image or a user's avatar but with contrast.
* **convert-image:** Converts an image from one format to another.
* **create-qr-code:** Converts text to a QR Code.
* **crop-to-content:** Crops an image to its content.
* **desaturate:** Draws an image or a user's avatar but desaturated.
* **dexter:** Draws an image or a user's avatar over the screen of Dexter from Pokémon.
* **distort:** Draws an image or a user's avatar but distorted.
* **emboss:** Draws an image or a user's avatar but embossed.
* **fire-frame:** Draws a fiery border over an image or a user's avatar.
* **fish-eye:** Draws an image or a user's avatar but with a fish-eye lens.
* **frame:** Draws a frame around an image or a user's avatar.
* **ghost:** Draws an image or a user's avatar but with a ghost-like transparency.
* **glass-shatter:** Draws an image or a user's avatar with a glass shatter in front of it.
* **glitch:** Draws an image or a user's avatar but glitched.
* **greyscale:** Draws an image or a user's avatar in greyscale.
* **gun:** Draws a gun over an image or a user's avatar.
* **hands:** Draws creepy hands over an image or a user's avatar.
* **ifunny:** Draws an image with the iFunny logo.
* **implode:** Draws an image or a user's avatar but imploded.
* **invert:** Draws an image or a user's avatar but inverted.
* **lego-icon:** Edits an image or avatar onto a character icon from LEGO Star Wars.
* **liquid-rescale:** Draws an image or a user's avatar but with liquid rescale from ImageMagick.
* **mirror:** Draws an image or a user's avatar but mirrored on the X/Y axis (or both).
* **motion-blur:** Draws an image or a user's avatar with motion blur.
* **needs-more-jpeg:** Draws an image or a user's avatar as a low quality JPEG.
* **noise:** Draws an image or a user's avatar but with noise.
* **oil-painting:** Draws an image or a user's avatar but with oil paints.
* **pet:** Pets an image or a user's avatar.
* **pixelize:** Draws an image or a user's avatar pixelized.
* **pokemon-fusion:** Fuses two Generation I Pokémon together.
* **police-tape:** Draws police tape over an image or a user's avatar.
* **rainbow:** Draws a rainbow over an image or a user's avatar.
* **rejected:** Draws a "rejected" stamp over an image or a user's avatar.
* **resize:** Draws an image or a user's avatar resized to the size you want.
* **rotate:** Draws an image or a user's avatar but rotated a number of degrees.
* **sepia:** Draws an image or a user's avatar in sepia.
* **shake:** Draws an image or a user's avatar shaking.
* **silhouette:** Draws a silhouette of an image or a user's avatar.
* **sip:** Draws a user's avatar sipping tea.
* **sketch:** Draws an image or a user's avatar but sketched.
* **snapchat:** Creates a fake Snap from Snapchat with the image and text you provide.
* **spotify-now-playing:** Draws an image or a user's avatar on a Spotify album with the name and artist of your choice.
* **square:** Draws an image or a user's avatar as a square.
* **squish:** Draws an image or a user's avatar but squished across the X or Y axis.
* **steam-card:** Draws an image or a user's avatar on a Steam Trading Card.
* **subtitle:** Adds subtitles to an image.
* **swirl:** Draws an image or a user's avatar but swirled.
* **tint:** Draws an image or a user's avatar but tinted a specific color.
* **vignette:** Draws an image or a user's avatar with a vignette.
* **wanted:** Draws an image or a user's avatar over a wanted poster.
* **wild-pokemon:** Draws an image or a user's avatar over a wild Pokémon appearance.
* **you-died:** Sends a "You Died" screen over an image or a user's avatar.

### Image Text Manipulation:

* **ace-attorney:** Sends a text box from Ace Attorney with the quote and character of your choice.
* **achievement:** Sends a Minecraft achievement with the text of your choice.
* **axis-cult-sign-up:** Sends an Axis Cult Sign-Up sheet for you. Join today!
* **caution:** Creates a caution sign with the text of your choice.
* **certificate:** Sends a certificate of excellence with the name and reason of your choice.
* **chinese-restaurant:** Sends a Chinese restaurant sign with the text of your choice.
* **danger:** Creates a danger sign with the text of your choice.
* **font:** Types text in a specific font.
* **gandhi-quote:** Makes Mahatma Gandhi say the quote you want.
* **highway-sign:** Sends a highway sign sign with the text of your choice.
* **hollywood-star:** Sends a Hollywood Walk of Fame star with the name of your choice.
* **jeopardy-question:** Sends a Jeopardy Question with the text of your choice.
* **license-plate:** Creates a license plate with the text of your choice.
* **speed-limit:** Sends a Speed Limit sign with the limit of your choice.
* **spongebob-time-card:** Sends a Spongebob Time Card with the text of your choice.
* **tweet:** Sends a Twitter tweet with the user and text of your choice.
* **undertale:** Sends a text box from Undertale with the quote and character of your choice.
* **zero-dialogue:** Sends a text box from Megaman Zero with the quote of your choice.

### Avatar Manipulation:

* **avatar-fusion:** Draws a a user's avatar over a user's avatar.
* **eject:** Ejects a user.
* **hat:** Draws a hat over a user's avatar.
* **he-lives-in-you:** Draws a user's avatar over Simba from The Lion King's reflection.
* **hearts:** Draws hearts around a user's avatar.
* **i-have-the-power:** Draws a user's avatar over He-Man's face.
* **rip:** Draws a user's avatar over a gravestone.
* **status-button:** Creates a Discord status button from c99.nl.
* **steam-now-playing:** Draws a user's avatar over a Steam "now playing" notification.
* **triggered:** Draws a user's avatar over the "Triggered" meme.

### Meme Generators:

* **3000-years:** Draws an image or a user's avatar over Pokémon's "It's been 3000 years" meme.
* **alert:** Sends a Presidential Alert message with the text of your choice.
* **bart-chalkboard:** Sends a "Bart Chalkboard" meme with the text of your choice.
* **be-like-bill:** Sends a "Be Like Bill" meme with the name of your choice.
* **beautiful:** Draws a user's avatar over Gravity Falls' "Oh, this? This is beautiful." meme.
* **boardroom-meeting:** Sends a "Boardroom Meeting" meme with the text of your choice.
* **bottom-text:** Sends a bottom text meme.
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
* **i-cant-believe:** Sends a "I Can't believe it's not butter!" meme with the text of your choice.
* **i-fear-no-man:** Sends a "I fear no man" meme with the text of your choice.
* **if-those-kids-could-read:** Sends a "If those kids could read, they'd be very upset" meme with the text of your choice.
* **kyon-gun:** Draws an image or a user's avatar behind Kyon shooting a gun.
* **like:** Sends an "Everyone Liked That" meme with the image of your choice.
* **lisa-presentation:** Sends a "Lisa Presentation" meme with the presentation of your choice.
* **look-at-this-photograph:** Draws an image or a user's avatar over Nickelback's photograph.
* **look-what-karen-have:** Draws an image or a user's avatar over Karen's piece of paper.
* **mario-bros-views:** Sends a "Mario Bros. Views" meme with the text of your choice.
* **meme-gen:** Sends a meme with the text and background of your choice.
* **metamorphosis:** Sends a "My Metamorphosis Begins" meme with the image and text of your choice.
* **my-collection-grows:** Sends a "My collection grows richer" Nekopara meme with the text of your choice.
* **new-password:** Sends a "Weak Password/Strong Password" meme with the passwords of your choice.
* **nike-ad:** Sends a "Believe in Something" Nike Ad meme with the text of your choice.
* **panik-kalm-panik:** Sends a "Panik, Kalm, Panik" meme with the text of your choice.
* **phoebe-teaching-joey:** Sends a "Phoebe Teaching Joey" meme with text of your choice.
* **pills:** Sends a "Hard to Swallow Pills" meme with the text of your choice.
* **plankton-plan:** Sends a Plankton's Plan meme with steps of your choice.
* **raw:** Sends a "Give me x, and I wouldn't mind doing it raw!" meme with the text of your choice. (NSFW)
* **reaction-meme:** Sends a meme with the text and image of your choice.
* **scroll-of-truth:** Sends a "Scroll of Truth" meme with the text of your choice.
* **sexy-singles:** Sends an "Sexy Singles in Your Area" meme with the image of your choice. (NSFW)
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
* **ugly:** Draws an image or a user's avatar over the "It's even uglier up close" meme.
* **ultimate-tattoo:** Draws an image or a user's avatar as "The Ultimate Tattoo".
* **vietnam-flashbacks:** Edits Vietnam flashbacks behind an image or a user's avatar.
* **whiteboard:** Sends a "Jim Halpert point to whiteboard" meme with the text of your choice.
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
* **html-decode:** Decodes HTML characters to regular characters.
* **leet:** Converts text to l33t speak.
* **lolcat:** Converts text to lolcat.
* **lowercase:** Converts text to lowercase.
* **md5:** Creates a hash of text with the MD5 algorithm.
* **mocking:** SenDs TexT lIkE ThiS.
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
* **format-number:** Formats a number to look more readable.
* **gcd:** Determines two numbers' greatest common denominator.
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
* **animalese:** Makes animalese based on text.
* **dec-talk:** The world's best Text-to-Speech.
* **mindfulness:** Immerse yourself in some mindful quotes.
* **morse:** Converts text to morse code.
* **play:** Plays a YouTube video in your voice channel.
* **tts:** Say the text you provide in the accent you choose.

### Reminders:

* **delete-reminder:** Deletes your reminder(s) set in this channel.
* **remind:** Sets a reminder.

### Phone:

* **hang-up:** Hangs up the current phone call.
* **phone:** Starts a phone call with a random server.
* **phone-block:** Gives instructions for blocking a channel or server.
* **phone-info:** Gives information on the current phone call.

### Cleverbot:

* **cleverbot:** Starts a Cleverbot conversation.
* **cleverbot-end:** Ends the current Cleverbot chat.

### Other:

* **noop:** Does nothing.
* **portal-send:** Send a message to a portal channel.
* **prune:** Deletes up to 99 messages from the current channel.

## Credits
### NPM Packages
* [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus)
* [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)
* [@mediapipe/face_detection](https://www.npmjs.com/package/@mediapipe/face_detection)
* [@napi-rs/canvas](https://www.npmjs.com/package/@napi-rs/canvas)
* [@tensorflow-models/face-detection](https://www.npmjs.com/package/@tensorflow-models/face-detection)
* [@tensorflow/tfjs-node](https://www.npmjs.com/package/@tensorflow/tfjs-node)
* [@twemoji/parser](https://www.npmjs.com/package/@twemoji/parser)
* [bombsweeper.js](https://www.npmjs.com/package/bombsweeper.js)
* [bufferutil](https://www.npmjs.com/package/bufferutil)
* [cheerio](https://www.npmjs.com/package/cheerio)
* [city-timezones](https://www.npmjs.com/package/city-timezones)
* [cloc](https://www.npmjs.com/package/cloc)
* [common-tags](https://www.npmjs.com/package/common-tags)
* [connect4-ai](https://www.npmjs.com/package/connect4-ai)
* [custom-translate](https://www.npmjs.com/package/custom-translate)
* [didyoumean2](https://www.npmjs.com/package/didyoumean2)
* [discord.js](https://www.npmjs.com/package/discord.js)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [emoji-regex](https://www.npmjs.com/package/emoji-regex)
* [fen-validator](https://www.npmjs.com/package/fen-validator)
* [font-finder](https://www.npmjs.com/package/font-finder)
* [gifencoder](https://www.npmjs.com/package/gifencoder)
* [gm](https://www.npmjs.com/package/gm)
* [html-entities](https://www.npmjs.com/package/html-entities)
* [image-to-ascii](https://www.npmjs.com/package/image-to-ascii)
* [ioredis](https://www.npmjs.com/package/ioredis)
* [js-chess-engine](https://www.npmjs.com/package/js-chess-engine)
* [jszip](https://www.npmjs.com/package/jszip)
* [kuroshiro](https://www.npmjs.com/package/kuroshiro)
* [kuroshiro-analyzer-kuromoji](https://www.npmjs.com/package/kuroshiro-analyzer-kuromoji)
* [mathjs](https://www.npmjs.com/package/mathjs)
* [minimist](https://www.npmjs.com/package/minimist)
* [moment](https://www.npmjs.com/package/moment)
* [moment-duration-format](https://www.npmjs.com/package/moment-duration-format)
* [moment-timezone](https://www.npmjs.com/package/moment-timezone)
* [node-superfetch](https://www.npmjs.com/package/node-superfetch)
* [nsfwjs](https://www.npmjs.com/package/nsfwjs)
* [ntcjs](https://www.npmjs.com/package/ntcjs)
* [parse-domain](https://www.npmjs.com/package/parse-domain)
* [pokersolver](https://www.npmjs.com/package/pokersolver)
* [random-js](https://www.npmjs.com/package/random-js)
* [sagiri](https://www.npmjs.com/package/sagiri)
* [semver](https://www.npmjs.com/package/semver)
* [sherlockjs](https://www.npmjs.com/package/sherlockjs)
* [sodium-native](https://www.npmjs.com/package/sodium-native)
* [stackblur-canvas](https://www.npmjs.com/package/stackblur-canvas)
* [text-diff](https://www.npmjs.com/package/text-diff)
* [tictactoe-minimax-ai](https://www.npmjs.com/package/tictactoe-minimax-ai)
* [twitter-openapi-typescript](https://www.npmjs.com/package/twitter-openapi-typescript)
* [utf-8-validate](https://www.npmjs.com/package/utf-8-validate)
* [valid-url](https://www.npmjs.com/package/valid-url)
* [wavefile](https://www.npmjs.com/package/wavefile)
* [winston](https://www.npmjs.com/package/winston)
* [wuzzy](https://www.npmjs.com/package/wuzzy)
* [ytdl-core](https://www.npmjs.com/package/ytdl-core)
* [zip-to-timezone](https://www.npmjs.com/package/zip-to-timezone)
* [zlib-sync](https://www.npmjs.com/package/zlib-sync)

### Other Credits
* **changelog:**
   - [GitHub](https://github.com/) ([API](https://developer.github.com/v3/))
* **8-ball:**
   - [Mattel](https://www.mattel.com/en-us) ([Original Concept](https://www.mattelgames.com/games/en-us/kids/magic-8-ball))
* **acrostic:**
   - [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward) ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
* **advice:**
   - [Advice Slip](https://adviceslip.com/) ([API](https://api.adviceslip.com/))
* **affirmation:**
   - [Tilde Ann Thurium](https://github.com/annthurium) ([Affirmations Data](https://github.com/annthurium/affirmations/blob/master/affirmations.js))
* **axis-cult:**
   - [Axis Order Bot](https://www.reddit.com/r/axisorderbot/wiki/index) (Prayer Data)
   - [KONOSUBA -God's blessing on this wonderful world!](http://konosuba.com/) (Original Anime)
* **boredom:**
   - [Bored API](https://www.boredapi.com/) (API)
* **chuck-norris:**
   - [Chuck Norris](https://chucknorris.com/) (Himself)
   - [chucknorris.io](https://api.chucknorris.io/) ([API](https://api.chucknorris.io/))
* **fact:**
   - [Wikipedia](https://www.wikipedia.org/) ([API](https://en.wikipedia.org/w/api.php))
* **fact-core:**
   - [Valve](https://www.valvesoftware.com/en/) ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
* **fml:**
   - [FML](https://www.fmylife.com/) (FML Data)
* **github-zen:**
   - [GitHub](https://github.com/) ([Zen API](https://developer.github.com/v3/))
* **incorrect-quote:**
   - [ScatterPatter's Incorrect Quotes Generator](https://incorrect-quotes-generator.neocities.org/) (Quote Data)
* **joke:**
   - [JokeAPI](https://v2.jokeapi.dev/) (API)
* **light-novel-title:**
   - [LN title generator](https://salty-salty-studios.com/shiz/ln.php) (API)
* **magic-conch:**
   - [Nickelodeon](https://www.nick.com/) ([Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
* **name:**
   - [Random User Generator](https://randomuser.me/) ([API](https://randomuser.me/documentation))
* **never-have-i-ever:**
   - [PsyCat Games](https://psycatgames.com/) ([Statement Data](https://psycatgames.com/app/never-have-i-ever/))
* **number-fact:**
   - [Numbers API](http://numbersapi.com/) (Trivia API)
* **oracle-turret:**
   - [Valve](https://www.valvesoftware.com/en/) ([Original "Portal 2" Game](http://www.thinkwithportals.com/))
* **pun:**
   - [JokeAPI](https://v2.jokeapi.dev/) (API)
* **quote:**
   - [Luke Peavey](https://github.com/lukePeavey) ([Quotes Data](https://github.com/lukePeavey/quotable/blob/master/data/sample/quotes.json))
* **smw-level:**
   - [Nintendo](https://www.nintendo.com/) ([Original "Super Mario World" Game](https://www.nintendo.co.jp/n02/shvc/mw/index.html))
   - [SMWiki](http://www.smwiki.net/) ([Level Name Data](http://old.smwiki.net/wiki/List_of_Super_Mario_World_levels))
* **superpower:**
   - [Superpower Wiki](https://powerlisting.fandom.com/wiki/Superpower_Wiki) (Superpower Data)
   - [FANDOM](https://www.fandom.com/) ([API](https://powerlisting.fandom.com/api.php))
* **word:**
   - [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward) ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
* **yo-mama:**
   - [rdegges](https://github.com/rdegges) ([Joke Data](https://github.com/rdegges/yomomma-api/blob/master/jokes.txt))
* **bird:**
   - [shibe.online](https://shibe.online/) (API)
* **bunny:**
   - [bunnies.io](https://www.bunnies.io/) (API)
* **cat:**
   - [TheCatAPI](https://thecatapi.com/) ([API](https://docs.thecatapi.com/))
   - [Cat Facts API](https://catfact.ninja/) (API)
* **dog:**
   - [TheDogAPI](https://thedogapi.com/) ([API](https://docs.thedogapi.com/))
   - [Dog API](https://kinduff.github.io/dog-api/) (API)
* **duck:**
   - [Random-d.uk](https://random-d.uk/) ([API](https://random-d.uk/api))
* **fox:**
   - [RandomFox](https://randomfox.ca/) (API)
* **frog:**
   - [FROGLAND!](http://allaboutfrogs.org/froglnd.shtml) ([API](http://allaboutfrogs.org/funstuff/randomfrog.html))
* **goose:**
   - [nekos.life](https://nekos.life/) (API)
* **inspiration:**
   - [InspiroBot](https://inspirobot.me/) (API)
* **light-novel-cover:**
   - [LN cover generator](https://salty-salty-studios.com/shiz/lncovers.php) (API)
* **lizard:**
   - [nekos.life](https://nekos.life/) (API)
* **lorem-picsum:**
   - [Lorem Picsum](https://picsum.photos/) (API)
* **shiba:**
   - [shibe.online](https://shibe.online/) (API)
* **xiao:**
   - [Marvelous](http://www.marv.jp/) ([Images, Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
   - [SauceNAO](https://saucenao.com/) (API)
* **butt:**
   - [iCrawl](https://github.com/iCrawl) ([Code, Concept](https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/butts.js))
* **cuteness:**
   - [AzuraApple](https://github.com/AzuraApple) (Concept)
* **friendship:**
   - [Attype Studio](https://www.dafont.com/fadli-ramadhan-iskandar.d7339) ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
* **name-rater:**
   - [Pokémon](https://www.pokemon.com/us/) (Sprite)
* **psycho-pass:**
   - [PSYCHO-PASS](http://psycho-pass.com/) (Original Anime)
   - [Tatsumaki](https://tatsumaki.xyz/) (Concept)
   - [Psycho-Pass Wiki](https://psychopass.fandom.com/wiki/Psycho-Pass_Wiki) ([Crime Coefficient Levels Data](https://psychopass.fandom.com/wiki/Crime_Coefficient_(Index)))
* **ship:**
   - [Attype Studio](https://www.dafont.com/fadli-ramadhan-iskandar.d7339) ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
* **thicc:**
   - [0vertime-dev](https://github.com/0vertime-dev) (Concept)
* **think-of:**
   - [Attype Studio](https://www.dafont.com/fadli-ramadhan-iskandar.d7339) ([Pinky Cupid Font](https://www.dafont.com/pinky-cupid.font))
* **worth:**
   - [AzuraApple](https://github.com/AzuraApple) (Concept)
* **dark-light:**
   - [u/LennyMcLennington](https://www.reddit.com/user/LennyMcLennington) ([Image](https://www.reddit.com/r/discordapp/comments/8t04ag/this_image_shows_different_text_depending_on/))
   - [u/AelinSA](https://www.reddit.com/user/AelinSA) ([Image](https://www.reddit.com/r/discordapp/comments/9krnhr/preach_the_message_of_the_möth_with_this_magi))
   - [JoJo's Bizzare Adventure](http://www.araki-jojo.com/) (Original Anime)
   - [u/MoonlightCapital](https://www.reddit.com/user/MoonlightCapital/) ([Image](https://www.reddit.com/r/discordapp/comments/a9fr7x/troll_your_friends_with_this/))
* **eat-pant:**
   - [u/_Ebb](https://www.reddit.com/user/_Ebb) ([Image](https://www.reddit.com/r/Ooer/comments/52z589/eat_pant_maaaaaaaan/))
   - [20th Century Fox](https://www.foxmovies.com/) ([Original "The Simpsons" Show](http://www.simpsonsworld.com/))
* **eggs-get-laid:**
   - [KINMOZA!](http://www.kinmosa.com/) (Original Anime)
* **give-flower:**
   - [Marvelous](http://www.marv.jp/) ([Original "Rune Factory 4" Game](http://www.runefactory4.com/index1.html))
* **rickroll:**
   - [Rick Astley](https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw) ([Original Music Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ))
* **where-is-everybody:**
   - [DreamWorks](https://www.dreamworks.com/) ([Images, Original "Shrek" Movie](https://www.dreamworks.com/movies/shrek))
* **yoff:**
   - [1Computer1](https://github.com/1Computer1) (Images)
* **anime-airing:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
* **apod:**
   - [NASA](https://www.nasa.gov/) ([APOD API](https://api.nasa.gov/))
* **florida-man:**
   - [floridamanbirthday.org](https://floridamanbirthday.org/) (News Data)
* **google-doodle:**
   - [Google](https://www.google.com/) ([Google Doodles API](https://www.google.com/doodles))
* **horoscope:**
   - [astrology.TV](https://astrology.tv/) ([Horoscope Data](https://astrology.tv/horoscope/daily/))
* **neko-atsume-password:**
   - [Neko Atsume: Kitty Collector](http://nekoatsume.com/en/) (API, Original Game)
   - [jasmaa](https://github.com/jasmaa/) ([API URL](https://github.com/jasmaa/nekoatsume-password-learner/blob/master/neko_pswd.py#L4))
* **time:**
   - [Wikipedia](https://www.wikipedia.org/) ([Time Zone Data](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
   - [Neopets](http://www.neopets.com/) (Neopia Time Zone)
* **today-in-history:**
   - [muffinlabs - Today in History](http://history.muffinlabs.com/) ([API](http://history.muffinlabs.com/#api))
* **us-election:**
   - [Election Betting Odds](https://electionbettingodds.com/) (Betting Data)
* **word-of-the-day:**
   - [Merriam-Webster's Collegiate® Dictionary](https://www.merriam-webster.com/) ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
* **anilist:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
* **anime:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
   - [MyAnimeList](https://myanimelist.net/) (Score Data)
* **anime-character:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
* **anime-staff:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
* **define:**
   - [Merriam-Webster's Collegiate® Dictionary](https://www.merriam-webster.com/) ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
* **frinkiac:**
   - [Frinkiac](https://frinkiac.com/) (API)
* **github:**
   - [GitHub](https://github.com/) ([API](https://developer.github.com/v3/))
* **google-autofill:**
   - [Google](https://www.google.com/) (Autofill API)
* **gravatar:**
   - [Gravatar](https://en.gravatar.com/) ([API](https://en.gravatar.com/site/implement/))
* **http-cat:**
   - [HTTP Cats](https://http.cat/) (API)
* **know-your-meme:**
   - [Know Your Meme](https://knowyourmeme.com/) (Meme Data)
* **lorcana:**
   - [Ravensburger](https://www.disneylorcana.com/en-US) (Original Game)
   - [Lorcana API](https://lorcana-api.com/Home.html) (API)
* **magic:**
   - [Wizards of the Coast](https://company.wizards.com/en) ([Original Game](https://magic.wizards.com/en))
   - [Scryfall](https://scryfall.com/) ([API](https://scryfall.com/docs/api))
* **manga:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
   - [MyAnimeList](https://myanimelist.net/) (Score Data)
* **nasa:**
   - [NASA](https://www.nasa.gov/) ([NASA Image and Video Library API](https://api.nasa.gov/))
* **neopet:**
   - [Neopets](http://www.neopets.com/) (Pet Image Data, Original Game)
* **neopets-item:**
   - [Neopets](http://www.neopets.com/) (Original Game)
   - [JellyNeo Item Database](https://items.jellyneo.net/) (Item Data)
* **npm:**
   - [npm](https://www.npmjs.com/) (API)
* **periodic-table:**
   - [Bowserinator](https://github.com/Bowserinator/) ([Periodic Table Data](https://github.com/Bowserinator/Periodic-Table-JSON))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **urban:**
   - [Urban Dictionary](https://www.urbandictionary.com/) ([API](https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation))
* **wikipedia:**
   - [Wikipedia](https://www.wikipedia.org/) ([API](https://en.wikipedia.org/w/api.php))
* **xkcd:**
   - [xkcd](https://xkcd.com/) ([API](https://xkcd.com/json.html))
* **yu-gi-oh:**
   - [Konami](https://www.konami.com/en/) ([Original "Yu-Gi-Oh!" Game](https://www.yugioh-card.com/en/))
   - [YGOPRODECK](https://ygoprodeck.com/) ([API](https://db.ygoprodeck.com/api-guide/))
* **pokedex:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 8-9)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)](https://play.pokemonshowdown.com/audio/cries/))
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **pokedex-ability:**
   - [Pokémon](https://www.pokemon.com/us/) (Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
* **pokedex-box-sprite:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **pokedex-cry:**
   - [Pokémon](https://www.pokemon.com/us/) (Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 8-9)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)](https://play.pokemonshowdown.com/audio/cries/))
* **pokedex-image:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
* **pokedex-item:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
* **pokedex-location:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **pokedex-move:**
   - [Pokémon](https://www.pokemon.com/us/) (Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
* **pokedex-moveset:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **pokedex-stats:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **smogon:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Smogon](https://www.smogon.com/) (Tier Data)
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Box Sprite Sheet](https://play.pokemonshowdown.com/sprites/))
* **gender:**
   - [Genderize.io](https://genderize.io/) (API)
* **is-it-down:**
   - [Is It Down Right Now?](https://www.isitdownrightnow.com/) (API)
* **read-qr-code:**
   - [goQR.me](http://goqr.me/) ([QR code API](http://goqr.me/api/))
* **scrabble-score:**
   - [Hasbro](https://shop.hasbro.com/en-us) ([Original "Scrabble" Game](https://scrabble.hasbro.com/en-us))
* **screenshot:**
   - [Thum.io](https://www.thum.io/) (API)
* **20-questions:**
   - [20Q.net](http://20q.net/) (API)
* **akinator:**
   - [Akinator](https://en.akinator.com/) (API)
* **anagramica:**
   - [Max Irwin](http://binarymax.com/) ([Original "Anagramica" Game, API](http://anagramica.com/))
* **anime-score:**
   - [AniList](https://anilist.co/) ([API](https://anilist.gitbook.io/anilist-apiv2-docs/))
* **antidepressant-or-tolkien:**
   - [Antidepressants or Tolkien](https://antidepressantsortolkien.now.sh/) (Question Data)
* **box-choosing:**
   - [07th Expansion](http://07th-expansion.net/) (Original Game)
   - [MangaGamer.com](https://www.mangagamer.com/) ([Original Translation](https://store.steampowered.com/app/526490/Higurashi_When_They_Cry_Hou__Ch4_Himatsubushi/))
* **captcha:**
   - [Christoph Mueller](https://www.fontsquirrel.com/fonts/list/foundry/christoph-mueller) ([Moms Typewriter Font](https://www.fontsquirrel.com/fonts/MomsTypewriter))
* **doors:**
   - [Mythbusters](https://go.discovery.com/tv-shows/mythbusters) (Concept)
   - [Monty Hall problem](https://en.wikipedia.org/wiki/Monty_Hall_problem) (Concept)
* **google-feud:**
   - [Google](https://www.google.com/) (Autofill API)
   - [Google Feud](http://www.googlefeud.com/) (Original Game)
* **guess-song:**
   - [Spotify](https://www.spotify.com/us/) ([API](https://developer.spotify.com/))
* **hangman:**
   - [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward) ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
   - [Merriam-Webster's Collegiate® Dictionary](https://www.merriam-webster.com/) ([API](https://dictionaryapi.com/products/api-collegiate-dictionary))
* **hearing-test:**
   - [Noise addicts](http://www.noiseaddicts.com/) ([Sounds](http://www.noiseaddicts.com/2011/06/mosquito-ringtones/))
* **horse-race:**
   - [Ambition](https://ambition.com/) ([Image](https://help.ambition.com/hc/en-us/articles/360005048011-How-do-I-set-up-a-Leaderboard-Slide-))
   - [Free SVG](https://freesvg.org/) ([Image](https://freesvg.org/race-horse))
   - [Iconian Fonts](https://www.fontspace.com/iconian-fonts) ([Paladins Font](https://www.fontspace.com/paladins-font-f32777))
   - [Stadium Talk](https://www.stadiumtalk.com/) ([Horse Name Data](https://www.stadiumtalk.com/s/best-racehorse-names-be7b8ad6b49a42df))
   - [LoveToKnow](https://www.lovetoknow.com/) ([Horse Name Data](https://horses.lovetoknow.com/horse-names/funny-horse-names))
* **hunger-games:**
   - [BrantSteele](https://brantsteele.com/) ([Original "Hunger Games Simulator" Game](http://brantsteele.net/hungergames/reaping.php))
* **jeopardy:**
   - [jService](https://jservice.xyz/) (API)
   - [Jeopardy](https://www.jeopardy.com/) (Music, Original Show)
   - [OPTIFONT](http://opti.netii.net/) ([Korinna Agency Font](https://fontmeme.com/fonts/korinna-agency-font/))
* **mad-libs:**
   - [Mad Libs](http://www.madlibs.com/) (Original Game)
   - [Mad:)Takes](https://www.madtakes.com/index.php) (Mad Libs Data)
* **pokemon-advantage:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [Shutterstock](https://www.shutterstock.com/) ([Background Image](https://www.shutterstock.com/video/search/anime-zoom))
   - [United States Judo Federation](https://www.usjf.com/) ([Stars Image](https://www.usjf.com/2019/11/five-star-dojo-program/))
   - [DaFont](https://www.dafont.com/) ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
   - [wavebeem](https://github.com/wavebeem) ([Type Advantage Data](https://github.com/wavebeem/pkmn.help/blob/master/src/data.ts))
* **quiz:**
   - [Open Trivia DB](https://opentdb.com/) ([API](https://opentdb.com/api_config.php))
* **sorting-hat:**
   - [Pottermore](https://my.pottermore.com/sorting) (Original Quiz)
   - [u/N1ffler](https://www.reddit.com/user/N1ffler/) ([Sorting Hat Quiz Analysis Data](https://www.reddit.com/r/Pottermore/comments/44os14/pottermore_sorting_hat_quiz_analysis/))
* **tarot:**
   - [dariusk](https://github.com/dariusk) ([Tarot Reading Data](https://github.com/dariusk/corpora/blob/master/data/divination/tarot_interpretations.json))
   - [Tarot Card Meanings](https://www.tarotcardmeanings.net/) ([Images](https://www.tarotcardmeanings.net/tarotcards.htm))
   - [Ask.Cards](http://askthecards.info/) (["Happy Squirrel" Card Reading and Image](http://askthecards.info/tarot_card_meanings/the_happy_squirrel.shtml))
   - [20th Century Fox](https://www.foxmovies.com/) ([Original "The Simpsons" Show, "Happy Squirrel" Concept](http://www.simpsonsworld.com/))
* **true-or-false:**
   - [Open Trivia DB](https://opentdb.com/) ([API](https://opentdb.com/api_config.php))
* **whos-that-pokemon:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [4Kids](https://www.4kidsentertainmentinc.com/) ("Who's That Pokémon?" Sound)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [u/CaptainRako](https://www.reddit.com/user/CaptainRako/) ([Background Image](https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/))
   - [DaFont](https://www.dafont.com/) ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 8-9)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)](https://play.pokemonshowdown.com/audio/cries/))
* **whos-that-pokemon-cry:**
   - [Pokémon](https://www.pokemon.com/us/) (Images, Original Game)
   - [PokéAPI](https://pokeapi.co/) (API)
   - [Serebii.net](https://www.serebii.net/index2.shtml) (Images)
   - [u/CaptainRako](https://www.reddit.com/user/CaptainRako/) ([Background Image](https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/))
   - [DaFont](https://www.dafont.com/) ([Pokemon Solid Font](https://www.dafont.com/pokemon.font))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 1-7)](https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/))
   - [The Sounds Resource](https://www.sounds-resource.com/) ([Cry Sound Effects (Gen 8-9)](https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/))
   - [Pokémon Showdown](https://play.pokemonshowdown.com/) ([Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)](https://play.pokemonshowdown.com/audio/cries/))
* **would-you-rather:**
   - [wouldurather.io](https://wouldurather.io) (API)
* **apples-to-apples:**
   - [Mattel](https://www.mattel.com/en-us) ([Original "Apples to Apples" Game, Card Data](https://www.mattelgames.com/games/en-us/family/apples-apples))
   - [JSON Against Humanity](https://www.crhallberg.com/cah/) (Card Data)
* **balloon-pop:**
   - [PAC-MAN Party](http://pacman.com/en/pac-man-games/pac-man-party) (Concept)
* **car-race:**
   - [iStock](https://www.istockphoto.com/) ([Background Image](https://www.istockphoto.com/vector/side-view-of-a-road-with-a-crash-barrier-roadside-green-meadow-and-clear-blue-sky-gm1081596948-290039955))
   - [Currituck County](https://co.currituck.nc.us/) ([Fireworks Image](https://co.currituck.nc.us/fireworks/))
   - [Max Pixel](https://www.maxpixel.net/) ([Stars Image](https://www.maxpixel.net/Stars-Confetti-Curly-String-Balloons-Watercolor-5403247))
   - [PNGkit](https://www.pngkit.com/) ([Earnhardt Car Image](https://www.pngkit.com/bigpic/u2r5r5o0a9y3w7q8/))
   - [Hendrick Motorsports](http://www.hendrickmotorsports.com/) (Earnhardt Car Original Design)
   - [Dale Earnhardt Jr.](https://www.dalejr.com/) (Earnhardt Car Original Driver)
   - [Disneyclips.com](https://www.disneyclips.com/main.html) ([McQueen Car Image](https://www.disneyclips.com/images2/cars2.html))
   - [Disney](https://www.disney.com/) (McQueen/Herbie Cars Original Designs)
   - [Pixar Animation Studios](https://www.pixar.com/) ([McQueen Car Original Design](https://www.pixar.com/feature-films/cars))
   - [NicolasDavila](https://www.deviantart.com/nicolasdavila) ([Reverb Car Image](https://www.deviantart.com/nicolasdavila/art/Reverb-Wireframe-Blueprint-777342814))
   - [Mattel](https://www.mattel.com/en-us) ([Reverb/Deora Cars Original Designs](https://hotwheels.mattel.com/shop))
   - [Sherif Saad](https://www.behance.net/SherifSaad) ([AE86 Car Image](https://www.behance.net/gallery/62672149/AE86-Tattoo))
   - [Initial D](https://initiald-portal.com/) (AE86 Car Original Design)
   - [ClipArtBest](http://www.clipartbest.com/) ([Kitano Car Image](http://www.clipartbest.com/clipart-KinXey4XT))
   - [Electronic Arts](https://www.ea.com/) ([Kitano Car Original Design](https://www.ea.com/games/burnout))
   - [Marien Bierhuizen](https://www.racedepartment.com/members/marien-bierhuizen.280739/) ([F1 Car Image](https://www.racedepartment.com/downloads/f2018-car-sideviews.22450/updates))
   - [La Linea](https://www.lalinea.de/) ([Elise Car Image](https://www.lalinea.de/pkw/neuwagen/lotus/elise/roadster-2-tuerer/2011/))
   - [Lotus](https://www.lotuscars.com/en-US/) (Elise Car Original Design)
   - [PNGkey.com](https://www.pngkey.com/) ([Sonic Car Image](https://www.pngkey.com/maxpic/u2e6y3t4a9o0a9a9/))
   - [SEGA](https://www.sega.com/) ([Sonic Car Original Design](https://www.sonicthehedgehog.com/))
   - [MinionFan1024](https://www.deviantart.com/minionfan1024) ([Anakin Car Image](https://www.deviantart.com/minionfan1024/art/Anakin-s-podracer-829694073))
   - [Star Wars](https://www.starwars.com/) (Anakin Car Original Design)
   - [theraymachine](https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/overview) ([DeLorean Car Image](https://www.gran-turismo.com/ch/gtsport/user/profile/1679092/gallery/all/decal/1679092/7359459034929333784))
   - [Back to the Future](https://www.backtothefuture.com/) (DeLorean Car Original Design)
   - [Kevin Zino](https://codepen.io/natefr0st) ([Mario Car Image](https://codepen.io/natefr0st/pen/GrMrZV))
   - [Nintendo](https://www.nintendo.com/) ([Mario Car Original Design](https://mario.nintendo.com/))
   - [zekewhipper](https://www.deviantart.com/zekewhipper) ([Mach 5 Car Image](https://www.deviantart.com/zekewhipper/art/Mach-5-My-Version-112814534))
   - [Speed Racer](https://www.speedracergogogo.com/) (Mach 5 Car Original Design)
   - [Iconscout](https://iconscout.com/) ([Runner Car Image](https://iconscout.com/illustrations/marathon-race))
   - [pixabay](https://pixabay.com/) ([Cybertruck Car Image](https://pixabay.com/vectors/tesla-cybertruck-electric-car-4770084/))
   - [Tesla](https://www.tesla.com/) ([Cybertruck Car Original Design](https://www.tesla.com/cybertruck))
   - [Zero Error's randomised blog](http://yanko06.blogspot.com/) ([Lego Car Image](http://yanko06.blogspot.com/2016/03/nissan-240sx-lego-build.html))
   - [LEGO](https://www.lego.com/en-us) (Lego Car Original Design)
   - [Stick PNG](https://www.stickpng.com/) ([Horse Car Image](https://www.stickpng.com/img/animals/horses/race-horse-side-view))
   - [DashieSparkle](https://www.deviantart.com/dashiesparkle) ([Rainbow Car Image](https://www.deviantart.com/dashiesparkle/art/Vector-475-Rainbow-Dash-58-609921260))
   - [Hasbro](https://shop.hasbro.com/en-us) ([Rainbow Car Original Design](https://mylittlepony.hasbro.com/en-us))
   - [MotorBiscuit](https://www.motorbiscuit.com/) ([Pickup Car Image](https://www.motorbiscuit.com/1000-hp-nissan-franken-navara-worlds-best-pickup-says-builder/))
   - [Lake Keowee Chrysler Dodge Jeep Ram](https://www.lakekeoweechryslerdodge.com/) ([Jeep Car Image](https://www.lakekeoweechryslerdodge.com/2017-jeep-wrangler-seneca--sc.htm))
   - [Jeep](https://www.jeep.com/) (Jeep Car Original Design)
   - [The BLOODHOUND Project](https://www.bloodhoundlsr.com/) ([Bloodhound Car Image/Original Design](http://sendy.bloodhoundssc.com/w/r66GIuC7uX1SMJnEzBQclA/RYS3PGArp6y5QLtigCCOVA/3JZqlel0Hcux67634uBAdtpg))
   - [PNGio.com](https://pngio.com/png) ([General Lee Car Image](https://pngio.com/images/png-a980119.html))
   - [Warner Bros.](https://www.warnerbros.com/) (General Lee Car Original Design)
   - [PicsArt](https://picsart.com/) ([Bean Car Image](https://picsart.com/i/287426979049211))
   - [Mr. Bean](https://www.mrbean.com/) (Bean Car Original Design)
   - [SeekPNG](https://www.seekpng.com/) ([Herbie Car Image](https://www.seekpng.com/ima/u2q8r5a9y3t4w7u2/))
   - [TVS Racing](https://www.tvsracing.com/) (Motorcycle Car Image)
   - [KYB Sport](https://kybsport.com/) ([Miku Car Image](https://kybsport.com/teams/gsr/))
   - [Goodsmile Racing](https://www.goodsmileracing.com/en/) (Miku Car Original Design)
   - [KOSTYA_ex_tubli](https://www.gran-turismo.com/us/gtsport/user/profile/6290075/overview) ([Flintstones Car Image](https://www.gran-turismo.com/us/gtsport/user/discover/search/decal/decal/6290075/4684382513076895744))
   - [Hanna-Barbera](http://www.webrockonline.com/) (Flintstones Car Original Design)
   - [Clipart Library](http://clipart-library.com/) ([Plane Car Image](http://clipart-library.com/clipart/228505.htm))
   - [Pin Clipart](https://www.pinclipart.com/) ([Wheelchair Car Image](https://www.pinclipart.com/maxpin/xToJi/))
   - [Clip Art Mag](http://clipartmag.com/) ([Deora Car Image](http://clipartmag.com/download-clipart-image#55-chevy-drawing-24.jpg))
* **cards-against-humanity:**
   - [Cards Against Humanity](https://cardsagainsthumanity.com/) (Original Game, Card Data)
   - [JSON Against Humanity](https://www.crhallberg.com/cah/) (Card Data)
* **chess:**
   - [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page) ([Piece Images](https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent))
   - [Chess.com](https://www.chess.com/) (Board Image)
* **connect-four:**
   - [Hasbro](https://shop.hasbro.com/en-us) (Original "Connect Four" Game)
* **emoji-emoji-revolution:**
   - [Dance Dance Revolution](https://www.ddrgame.com/) (Concept)
* **guesspionage:**
   - [Jackbox Games](https://www.jackboxgames.com/) ([Original "Guesspionage" Game](https://www.jackboxgames.com/guesspionage/))
   - [Playstation Trophies](https://www.playstationtrophies.org/) ([Question Data](https://www.playstationtrophies.org/game/the-jackbox-party-pack-3/trophy/157520-Guesspionage--Perfect-Surveillance.html))
   - [TrueAchievements](https://www.trueachievements.com/) ([Question Data](https://www.trueachievements.com/forum/viewthread.aspx?tid=850920))
* **jenga:**
   - [Jenga](https://jenga.com/) (Original Game)
* **lie-swatter:**
   - [Jackbox Games](https://www.jackboxgames.com/) ([Original "Lie Swatter" Game](https://www.jackboxgames.com/lie-swatter/))
   - [Open Trivia DB](https://opentdb.com/) ([API](https://opentdb.com/api_config.php))
* **quiz-duel:**
   - [Open Trivia DB](https://opentdb.com/) ([API](https://opentdb.com/api_config.php))
* **word-chain:**
   - [Grady Ward](https://en.wikipedia.org/wiki/Grady_Ward) ([Moby Word Lists](http://www.gutenberg.org/ebooks/3201))
* **word-spud:**
   - [Jackbox Games](https://www.jackboxgames.com/) ([Original "Word Spud" Game](https://www.jackboxgames.com/word-spud/))
* **danny-devito:**
   - [Danny DeVito](https://twitter.com/dannydevito) (Himself)
* **shrek:**
   - [DreamWorks](https://www.dreamworks.com/) ([Images, Original "Shrek" Movie](https://www.dreamworks.com/movies/shrek))
* **analog-clock:**
   - [Wikipedia](https://www.wikipedia.org/) ([Time Zone Data](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
   - [Neopets](http://www.neopets.com/) (Neopia Time Zone)
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **approved:**
   - [Redeeming God](https://redeeminggod.com/) ([Image](https://redeeminggod.com/courses/gospel-dictionary/lessons/gospel-dictionary-approved/))
* **bob-ross:**
   - [Know Your Meme](https://knowyourmeme.com/) ([Image](https://knowyourmeme.com/photos/1160348))
   - [Bob Ross](https://www.bobross.com/) (Himself)
* **brazzers:**
   - [Brazzers](https://www.brazzers.com/) (Logo)
* **charcoal:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **communist:**
   - [PNGFuel](https://www.pngfuel.com/) ([Image](https://www.pngfuel.com/free-png/osnol))
* **create-qr-code:**
   - [goQR.me](http://goqr.me/) ([QR code API](http://goqr.me/api/))
* **dexter:**
   - [Pokémon](https://www.pokemon.com/us/) (Image, Original Anime)
* **emboss:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **fire-frame:**
   - [susi1959](https://en.picmix.com/profile/susi1959) ([Image](https://en.picmix.com/stamp/FIRE-FRAME-ORANGE-cadre-feu-orange-360274))
* **fish-eye:**
   - [Hackyon](http://www.hackyon.com/playground/fisheye/) (Fish-Eye Code)
* **frame:**
   - [www.aljanh.net](http://www.aljanh.net/) ([Classic Image](http://www.aljanh.net/frame-wallpapers/1508614706.html))
* **glass-shatter:**
   - [Platinum Designz](http://store.platinumdesignz.com/) ([Image](https://www.jing.fm/iclipt/u2q8u2a9o0t4i1q8/))
* **gun:**
   - [Luxoflux](http://www.luxoflux.com/) ([Image](https://knowyourmeme.com/memes/hand-pointing-a-gun))
* **hands:**
   - [Know Your Meme](https://knowyourmeme.com/) ([Image](https://knowyourmeme.com/photos/1583323-screen-reaching-emoji))
* **ifunny:**
   - [iFunny](https://ifunny.co/) (Logo)
* **implode:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **lego-icon:**
   - [LEGO](https://www.lego.com/en-us) ([Original Design](https://store.steampowered.com/app/32440/LEGO_Star_Wars__The_Complete_Saga/))
   - [u/PowderedShmegma](https://www.reddit.com/user/PowderedShmegma/) ([Image](https://www.reddit.com/r/legostarwars/comments/eheb76/lego_sw_character_icon_template/))
* **liquid-rescale:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **noise:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **oil-painting:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **pokemon-fusion:**
   - [Pokémon](https://www.pokemon.com/us/) (Original Game)
   - [Pokemon Fusion](https://pokemon.alexonsager.net/) (Images)
* **police-tape:**
   - [PNG Arts](https://www.pngarts.com/) ([Image](https://www.pngarts.com/explore/94078))
* **rejected:**
   - [Clipart Library](http://clipart-library.com/) ([Image](http://clipart-library.com/clipart/Rejected-Stamp-Transparent.htm))
* **sip:**
   - [CoolClips.com](http://search.coolclips.com/) ([Image](http://search.coolclips.com/m/vector/hand0007/Hands-holding-mug/))
* **sketch:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **snapchat:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Snapchat](https://www.snapchat.com/) (Design)
* **spotify-now-playing:**
   - [Spotify](https://www.spotify.com/us/) (Original Design)
   - [Sam Thik](https://www.pinterest.com/Samthik/) ([Image](https://www.pinterest.com/pin/500251471109108490/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **squish:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **steam-card:**
   - [Steam](https://store.steampowered.com/) ([Original Design](https://steamcommunity.com/tradingcards/))
   - [SinKillerJ Tachikawa](https://www.deviantart.com/sinkillerj) ([Template](https://www.deviantart.com/sinkillerj/art/Steam-Trading-Card-Template-GIMP-372156984))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **subtitle:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **swirl:**
   - [ImageMagick](https://imagemagick.org/index.php) (Image Manipulation)
* **wanted:**
   - [Tim's Printables](https://www.timvandevall.com/) ([Image](https://www.pinterest.com/pin/365002744774849370/))
* **wild-pokemon:**
   - [Pokémon](https://www.pokemon.com/us/) (Image, Original Game)
   - [Jackster Productions](https://www.fontspace.com/jackster-productions) ([Pokemon GB Font](https://www.fontspace.com/pokemon-gb-font-f9621))
* **you-died:**
   - [FromSoftware](https://www.fromsoftware.jp/ww/) (Image, Original "Dark Souls" Game)
* **ace-attorney:**
   - [Capcom](http://www.capcom.com/us/) ([Images, Original "Ace Attorney" Game](http://www.ace-attorney.com/))
   - [Enkidulga](https://www.dafont.com/profile.php?user=736583) ([Ace Attorney Font](https://www.dafont.com/ace-attorney.font))
* **achievement:**
   - [Mojang](https://www.mojang.com/) ([Original "Minecraft" Game](https://www.minecraft.net/en-us/))
   - [Minecraft Achievement Generator](https://www.minecraftskinstealer.com/achievement/) (Image)
   - [Andrew Tyler](https://www.dafont.com/andrew-tyler.d2526) ([Minecraftia Font](https://www.dafont.com/minecraftia.font))
* **axis-cult-sign-up:**
   - [cheesecakejedi](https://imgur.com/user/cheesecakejedi) ([Image](https://imgur.com/gallery/quQTD))
   - [hbl917070](https://github.com/hbl917070) ([Font](https://github.com/hbl917070/Konosuba-text))
   - [KONOSUBA -God's blessing on this wonderful world!](http://konosuba.com/) (Original Anime)
* **caution:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page) ([Image](https://commons.wikimedia.org/wiki/File:Caution_blank.svg))
* **certificate:**
   - [Creative Certificates](https://www.creativecertificates.com/) ([Image](https://www.creativecertificates.com/award-certificate-templates/))
   - [Cheng Xiao](https://www.instagram.com/chengxiao_0715/) (Signature)
   - [Monotype](https://www.monotype.com/) ([Old English Text MT Font](https://catalog.monotype.com/family/monotype/monotype-old-english-text))
* **chinese-restaurant:**
   - [ATOM.SMASHER.ORG](http://atom.smasher.org/) ([Image](http://atom.smasher.org/chinese/))
   - [Fontsgeek](http://fontsgeek.com/) ([Futura Condensed Font](http://fontsgeek.com/fonts/Futura-Condensed-Bold))
* **danger:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page) ([Image](https://commons.wikimedia.org/wiki/File:Danger_blank.svg))
* **gandhi-quote:**
   - [GUST e-foundry](https://www.fontsquirrel.com/fonts/list/foundry/gust-e-foundry) ([Latin Modern Roman Font](https://www.fontsquirrel.com/fonts/Latin-Modern-Roman))
* **highway-sign:**
   - [ATOM.SMASHER.ORG](http://atom.smasher.org/) ([Image](http://atom.smasher.org/construction/))
   - [Ash Pikachu Font](https://www.dafont.com/ashpikachu099.d2541) ([Electronic Highway Sign Font](https://www.dafont.com/electronic-highway-sign.font))
* **hollywood-star:**
   - [RedKid.Net](http://www.redkid.net/) ([Image](http://www.redkid.net/generator/star/))
   - [Alexey Star](https://alexeystar.com/) ([Hollywood Star Font](https://alexeystar.com/hollywood-star-font/))
   - [Hollywood Walk of Fame](https://walkoffame.com/) (Concept)
* **jeopardy-question:**
   - [Jeopardy](https://www.jeopardy.com/) (Original Show)
   - [OPTIFONT](http://opti.netii.net/) ([Korinna Agency Font](https://fontmeme.com/fonts/korinna-agency-font/))
* **license-plate:**
   - [Dave Hansen](https://www.fontspace.com/dave-hansen) ([License Plate Font](https://www.fontspace.com/license-plate-font-f3359))
   - [Pin Clipart](https://www.pinclipart.com/) ([Image](https://www.pinclipart.com/maxpin/bJxii/))
* **speed-limit:**
   - [RoadTrafficSigns](https://www.roadtrafficsigns.com/) ([Image](https://www.roadtrafficsigns.com/speed-limit-sign/speed-limit-70-sign/sku-x-r2-1-70.aspx))
   - [Ash Pikachu Font](https://www.dafont.com/ashpikachu099.d2541) ([Highway Gothic Font](https://www.dafont.com/highway-gothic.font))
* **spongebob-time-card:**
   - [Nickelodeon](https://www.nick.com/) ([Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
   - [Spongebob Fanon](https://spongebob-new-fanon.fandom.com/wiki/SpongeBob_Fanon_Wiki) ([Images](https://spongebob-new-fanon.fandom.com/wiki/Gallery_of_Textless_Title_Cards))
   - [nauticalspongeinc](https://www.fontspace.com/nauticalspongeinc) ([Spongeboytt1 Font](https://www.fontspace.com/spongeboytt1-font-f29761))
* **tweet:**
   - [Twitter](https://twitter.com/) ([Image, Chirp Font, API](https://developer.twitter.com/en/docs.html))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **undertale:**
   - [UNDERTALE](https://undertale.com/) (Original Game)
   - [Demirramon](https://www.demirramon.com/) ([Images](https://www.demirramon.com/en/generators/undertale_text_box_generator))
   - [Carter Sande](https://gitlab.com/cartr) ([DeterminationMono, UndertaleSans, and UndertalePapyrus Fonts](https://gitlab.com/cartr/undertale-fonts/tree/master))
   - [Sigmath Bits](https://fontstruct.com/fontstructors/1280718/sigmath6) ([Pixelated Wingdings Font](https://fontstruct.com/fontstructions/show/1218140/pixelated-wingdings))
   - [EarthBound Central](https://earthboundcentral.com/) ([Apple Kid Font](https://earthboundcentral.com/2009/11/ultimate-earthbound-font-pack/))
* **zero-dialogue:**
   - [Capcom](http://www.capcom.com/us/) ([Image, Original "Megaman Zero" Game](http://megaman.capcom.com/))
   - [Megadreamer](https://www.deviantart.com/megadreamer) ([Megaman Zero Dialogue Font](https://www.deviantart.com/megadreamer/art/Megaman-Zero-dialog-font-513708688))
* **eject:**
   - [Wisq](https://www.youtube.com/channel/UCrOS0iXaZgW45AdbEznGXLA) ([Images](https://www.youtube.com/watch?v=yx4Hp8TBVtQ))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [InnerSloth](https://innersloth.com/index.php) ([Original "Among Us" Game](https://innersloth.com/gameAmongUs.php))
* **hat:**
   - [Go Nintendo](https://gonintendo.com/) ([Ash Hat Image](https://gonintendo.com/stories/306292))
   - [freeiconspng.com](https://www.freeiconspng.com/) ([Birthday Hat Image](https://www.freeiconspng.com/img/43917))
   - [Know Your Meme](https://knowyourmeme.com/) ([Christmas Hat Image](https://knowyourmeme.com/forums/just-for-fun/topics/24821-christmas-hat-thread))
   - [xertris](https://www.deviantart.com/xertris) ([Dunce Hat Image](https://www.deviantart.com/xertris/art/Dunce-Cap-634349483))
   - [Clipart Library](http://clipart-library.com/) ([Leprechaun Hat Image](http://clipart-library.com/clipart/1107361.htm))
   - [RedBubble - Akbar Mna](https://www.redbubble.com/en/people/akbarmna/shop) ([Megumin Hat Image](https://www.redbubble.com/people/akbarmna/works/25443591-megumins-hat-minimalistic?p=poster))
   - [Gallery Yopriceville](https://gallery.yopriceville.com/) ([Pilgrim Hat Image](https://gallery.yopriceville.com/Free-Clipart-Pictures/Thanksgiving-PNG/Transparent_Brown_Pilgrim_Hat_PNG_Clipart))
   - [DynamicPickaxe](http://dynamicpickaxe.com/) ([Pirate Hat Image](http://dynamicpickaxe.com/pirate-hat-clipart.html))
   - [ClipartsFree](https://www.clipartsfree.net/) ([Top Hat Image](https://www.clipartsfree.net/clipart/51355-gray-top-hat-clipart.html))
   - [KissClipart.com](https://www.kissclipart.com/) ([Witch Hat Image](https://www.kissclipart.com/halloween-witch-hat-clipart-witch-hat-clip-art-qfycyt/))
   - [festivalclaca.cat](https://www.festivalclaca.cat/) ([Soviet Hat Image](https://www.festivalclaca.cat/maxvi/mmbwJ/))
   - [Pokémon](https://www.pokemon.com/us/) (Ash Hat Original Anime)
   - [KONOSUBA -God's blessing on this wonderful world!](http://konosuba.com/) (Megumin Hat Original Anime)
   - [StickPNG](https://www.stickpng.com/) ([Mask Hat Image](https://www.stickpng.com/img/science/pandemic/white-surgical-face-mask-front-view))
   - [Why We Protest](https://whyweprotest.net/) ([Anon Hat Image](https://whyweprotest.net/threads/big-ass-guy-fawkes-mask-images-thread.22719/))
   - [WebStockReview](https://webstockreview.net/) ([Devil Hat Image](https://webstockreview.net/explore/horn-clipart-purple-devil/))
   - [Becel](https://www.becel.ca/en-ca) (Becel Hat Image)
   - [Joe Biden for President](https://joebiden.com/) (Biden Hat Image)
* **he-lives-in-you:**
   - [Disney](https://www.disney.com/) ([Image, Original "The Lion King" Movie](https://movies.disney.com/the-lion-king))
* **hearts:**
   - [Jessica Knable](https://picsart.com/u/jessicaknable) ([Image](https://picsart.com/i/sticker-hearts-heart-borders-frames-round-frame-border-love-263412201018212))
* **i-have-the-power:**
   - [Mattel](https://www.mattel.com/en-us) (Image, Original "He-Man" Show)
* **rip:**
   - [vician](https://www.123rf.com/profile_vician) ([Image](https://www.123rf.com/profile_vician?mediapopup=13181623))
   - [Iconian Fonts](https://www.fontspace.com/iconian-fonts) ([Coffin Stone Font](https://www.fontspace.com/coffin-stone-font-f40998))
* **status-button:**
   - [Discord Status Button](https://discord.c99.nl/) (API)
* **steam-now-playing:**
   - [Steam](https://store.steampowered.com/) (Original Design)
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **triggered:**
   - [NotAWeebDev](https://github.com/NotAWeebDev/) ([Image](https://github.com/NotAWeebDev/Misaki/blob/2e44f9efb467028dcbae5a2c9f836d2e99860b85/assets/images/plate_triggered.png))
* **3000-years:**
   - [Pokémon](https://www.pokemon.com/us/) (Image, Original Game)
* **alert:**
   - [Apple](https://www.apple.com/) ([San Francisco Font](https://developer.apple.com/fonts/))
   - [The Hill](https://thehill.com/) ([Image](https://thehill.com/policy/technology/409737-this-is-a-test-us-officials-test-presidential-alert))
* **bart-chalkboard:**
   - [20th Century Fox](https://www.foxmovies.com/) ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
   - [Jon Bernhardt](http://web.mit.edu/jonb/www/) ([Akbar Font](https://www.wobblymusic.com/groening/akbar.html))
* **be-like-bill:**
   - [gautamkrishnar](https://github.com/gautamkrishnar/) ([Image](https://github.com/gautamkrishnar/Be-Like-Bill))
   - [Monotype](https://www.monotype.com/) ([Arial Font](https://catalog.monotype.com/family/monotype/arial))
* **beautiful:**
   - [Disney](https://www.disney.com/) ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
   - [Tatsumaki](https://tatsumaki.xyz/) (Image)
* **boardroom-meeting:**
   - [hejibits](https://hejibits.com/) ([Image](https://web.archive.org/web/20121226235748/https://hejibits.com/comics/outlook-oust/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **bottom-text:**
   - [ShareFonts.net](https://www.wfonts.com/) ([Impact Font](https://www.wfonts.com/font/impact))
* **catch:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **challenger:**
   - [gman5846](https://www.deviantart.com/gman5846) ([Melee Image](https://www.deviantart.com/gman5846/art/SSBM-Challenger-Approaching-Template-861023507))
   - [Kevster823](https://www.deviantart.com/kevster823) ([Brawl Image](https://www.deviantart.com/kevster823/art/SSBB-Challenger-Approaching-Template-401524280))
   - [Jack The Awesomeness Gamer](https://www.youtube.com/channel/UCIeA23B91hAeR1UuC2VDSdQ) ([Smash 4 Image](https://www.youtube.com/watch?v=3FebRrXg0bk))
   - [MatthewThePrep](https://www.deviantart.com/matthewtheprep) ([Ultimate Image](https://www.deviantart.com/matthewtheprep/art/SSBU-Challenger-Approaching-meme-template-800422972))
   - [Nintendo](https://www.nintendo.com/) ([Original "Super Smash Bros." Game](https://www.smashbros.com/en_US/index.html))
* **change-my-mind:**
   - [Steven Crowder](https://www.youtube.com/StevenCrowder) ([Image](https://twitter.com/scrowder/status/964577508447449088))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **chi-idea:**
   - [u/THANOS_COPTER](https://www.reddit.com/user/THANOS_COPTER/) ([Image](https://www.reddit.com/r/Takagi_san/comments/gb4wdt/how_far_is_too_far/))
   - [Teasing Master Takagi-san](https://takagi3.me/) (Original "Teasing Master Takagi-san" Manga)
   - [Inside Scanlation](https://www.insidescanlation.com/) ([Wild Words Font](https://www.insidescanlation.com/etc/the-idiots-guide-to-editing-manga/guide/type/fonts.html))
* **crush:**
   - [Marvel](https://www.marvel.com/) ([Image, Original "X-Men" Comic](https://www.marvel.com/teams-and-groups/x-men))
* **cursed-sponge:**
   - [Nickelodeon](https://www.nick.com/) ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
* **dear-liberals:**
   - [Turning Point USA](https://www.tpusa.com/) (Image)
   - [Google](https://www.google.com/) ([Oswald Font](https://fonts.google.com/specimen/Oswald))
* **demotivational:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **dislike:**
   - [Bethesda](https://bethesda.net/en/dashboard) ([Image, Original "Fallout" Game](https://fallout.bethesda.net/en/))
* **distracted-boyfriend:**
   - [Antonio Guillem](http://antonioguillem.com/) ([Image](https://www.istockphoto.com/photo/gm493656728-77018851))
* **drakeposting:**
   - [Drake](https://drakeofficial.com/) ([Original "Hotline Bling" Music Video](https://youtu.be/uxpDa-c-4Mc))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **edd-facts-book:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Cartoon Network](https://www.cartoonnetworkme.com/) ([Image, Original "Ed, Edd n Eddy" TV Series](https://www.cartoonnetworkme.com/show/ed-edd-n-eddy))
* **enslaved:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **food-broke:**
   - [@liltusk](https://twitter.com/liltusk) ([Image](https://twitter.com/liltusk/status/835719948597137408))
* **for-five-hours:**
   - [NBC](https://www.nbc.com/) ([Image, Original "The Office" TV Series](https://www.nbc.com/the-office))
* **genie-rules:**
   - [u/Two-Tone-](https://www.reddit.com/user/Two-Tone-/) ([Image](https://www.reddit.com/r/MemeTemplatesOfficial/comments/bht9o6/i_made_an_hd_high_quality_version_of_the_4_rules/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **girl-worth-fighting-for:**
   - [Disney](https://www.disney.com/) ([Original "Mulan" Movie](https://movies.disney.com/mulan))
   - [u/SupremeMemesXD](https://www.reddit.com/user/SupremeMemesXD/) ([Image](https://www.reddit.com/r/MemeTemplatesOfficial/comments/8h39vi/girl_worth_fighting_for_template/))
* **gru-plan:**
   - [Illumination](http://www.illumination.com/) ([Original "Despicable Me" Movie](http://www.despicable.me/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **i-cant-believe:**
   - [I Can't Believe It's Not Butter!](https://www.icantbelieveitsnotbutter.com/en) (Original Logo)
   - [Kong Font](https://www.dafont.com/kong-font.d8299) ([The Lord Night Font](https://www.dafont.com/the-lord-night.font))
* **i-fear-no-man:**
   - [Valve](https://www.valvesoftware.com/en/) ([Image, Original "Team Fortress 2" Game](https://www.teamfortress.com/))
* **if-those-kids-could-read:**
   - [20th Century Fox](https://www.foxmovies.com/) (Image, Original "King of the Hill" Show)
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **kyon-gun:**
   - [The Melancholy of Haruhi Suzumiya](http://www.haruhi.tv/) (Original Anime)
   - [Know Your Meme](https://knowyourmeme.com/) ([Image](https://knowyourmeme.com/photos/217992-endless-eight-kyon-kun-denwa))
* **like:**
   - [Bethesda](https://bethesda.net/en/dashboard) ([Image, Original "Fallout" Game](https://fallout.bethesda.net/en/))
* **lisa-presentation:**
   - [20th Century Fox](https://www.foxmovies.com/) ([Image, Original "The Simpsons" Show](http://www.simpsonsworld.com/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **look-at-this-photograph:**
   - [Nickelback](https://www.nickelback.com/) ([Image, Original "Photograph" Music Video](https://www.youtube.com/watch?v=BB0DU4DoPP4))
* **look-what-karen-have:**
   - [Know Your Meme](https://knowyourmeme.com/) ([Image](https://knowyourmeme.com/photos/1047091-kin-iro-mosaic-kinmoza))
   - [KINMOZA!](http://www.kinmosa.com/) (Original Anime)
* **mario-bros-views:**
   - [Nintendo](https://www.nintendo.com/) ([Original "Super Mario Bros." Game](https://mario.nintendo.com/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **meme-gen:**
   - [ShareFonts.net](https://www.wfonts.com/) ([Impact Font](https://www.wfonts.com/font/impact))
* **metamorphosis:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Yeah I'm Stuck in the Void, Keep Scrolling](https://www.facebook.com/voidmanthing/) ([Image](https://www.facebook.com/voidmanthing/posts/125724262420450))
* **my-collection-grows:**
   - [Nekopara](http://nekopara.com/main.html) ([Image, Original Anime](https://nekopara-anime.com/))
* **new-password:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **nike-ad:**
   - [Nike](https://www.nike.com/) (Logo, Concept)
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **panik-kalm-panik:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **phoebe-teaching-joey:**
   - [Warner Bros.](https://www.warnerbros.com/) ([Images, Original "Friends" TV Series](https://www.warnerbros.com/tv/friends/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **pills:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **plankton-plan:**
   - [Nickelodeon](https://www.nick.com/) ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **raw:**
   - [Inside Scanlation](https://www.insidescanlation.com/) ([Wild Words Font](https://www.insidescanlation.com/etc/the-idiots-guide-to-editing-manga/guide/type/fonts.html))
* **reaction-meme:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **scroll-of-truth:**
   - [Robotatertot](https://robotatertot.tumblr.com/) ([Image](https://robotatertot.tumblr.com/post/156736308530/truth))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **skyrim-skill:**
   - [Bethesda](https://bethesda.net/en/dashboard) ([Image, Original "The Elder Scrolls V: Skyrim" Game](https://elderscrolls.bethesda.net/en/skyrim))
   - [Fontsgeek](http://fontsgeek.com/) ([Futura Condensed Font](http://fontsgeek.com/fonts/Futura-Condensed-Regular))
* **sonic-says:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [SEGA](https://www.sega.com/) ([Image, Original "Sonic the Hedgehog" Game](https://www.sonicthehedgehog.com/))
* **sora-selfie:**
   - [Square Enix](https://square-enix-games.com/) ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
   - [@Candasaurus](https://twitter.com/Candasaurus) ([Image](https://twitter.com/Candasaurus/status/1041946636656599045))
* **sos:**
   - [Esther Verkest](https://www.facebook.com/Esther-Verkest-49667161749/) (Image)
   - [Walter E Stewart](https://www.1001freefonts.com/designer-walter-e-stewart-fontlisting.php) ([Sun Dried Font](https://www.1001freefonts.com/sun-dried.font))
* **spiderman-pointing:**
   - [Marvel](https://www.marvel.com/) ([Image, Original "Spiderman" Comic](https://spiderman.marvelhq.com/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **spongebob-burn:**
   - [Nickelodeon](https://www.nick.com/) ([Image, Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **that-sign-wont-stop-me:**
   - [PBS Kids](https://pbskids.org/) ([Image, Original "Arthur" Show](https://pbskids.org/arthur/))
   - [Missy Meyer](https://missymeyer.com/) ([Tragic Marker Font](https://missymeyer.com/tragic-marker-free-font))
* **this-guy:**
   - [Warner Bros.](https://www.warnerbros.com/) ([Image, Original "Friends" TV Series](https://www.warnerbros.com/tv/friends/))
* **thug-life:**
   - [pngimg.com](https://pngimg.com/) ([Image](http://pngimg.com/download/58231))
* **to-be-continued:**
   - [JoJo's Bizzare Adventure](http://www.araki-jojo.com/) (Original Anime)
* **tuxedo-pooh:**
   - [Disney](https://www.disney.com/) ([Original "Winnie the Pooh" Movie](https://winniethepooh.disney.com/))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **two-buttons:**
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
   - [Jake Clark](https://jake-clark.tumblr.com/) ([Image](https://twitter.com/jakeclarkdude/status/689141113584619524))
* **ugly:**
   - [Nickelodeon](https://www.nick.com/) ([Original "Spongebob Squarepants" Show](https://www.nick.com/shows/spongebob-squarepants))
* **ultimate-tattoo:**
   - [Deathbulge](http://deathbulge.com/comics) ([Image](http://deathbulge.com/comics/114))
* **vietnam-flashbacks:**
   - [Horst Faas](https://en.wikipedia.org/wiki/Horst_Faas) (Image)
* **whiteboard:**
   - [NBC](https://www.nbc.com/) ([Image, Original "The Office" TV Series](https://www.nbc.com/the-office))
   - [Google](https://www.google.com/) ([Noto Font](https://www.google.com/get/noto/))
* **worse-than-hitler:**
   - [20th Century Fox](https://www.foxmovies.com/) ([Image, Original "Family Guy" Show](https://www.fox.com/family-guy/))
* **worthless:**
   - [Disney](https://www.disney.com/) ([Original "Gravity Falls" Show](https://disneynow.com/shows/gravity-falls))
* **brony-speak:**
   - [Hasbro](https://shop.hasbro.com/en-us) ([Original "My Little Pony: Friendship is Magic" Show](https://mylittlepony.hasbro.com/en-us))
   - [Shrick](https://www.deviantart.com/shrick) ([English-to-Brony Dictionary Data](https://www.deviantart.com/shrick/art/Brony-dictionary-version-2-207157029))
* **cow-say:**
   - [cowsay Online](http://cowsay.morecode.org/) (API)
* **leet:**
   - [1337.me](https://1337.me/) (Code)
* **lolcat:**
   - [speak lolcat](https://speaklolcat.com/) (Translation Data)
* **nobody-name:**
   - [Square Enix](https://square-enix-games.com/) ([Original "Kingdom Hearts" Game](https://www.kingdomhearts.com/home/us/))
* **owo:**
   - [devsnek](https://github.com/devsnek) (Code)
* **pirate:**
   - [mikewesthad](https://github.com/mikewesthad) ([English-to-Pirate Dictionary Data](https://github.com/mikewesthad/pirate-speak/blob/master/lib/pirate-speak.js#L1-L155))
* **shorten-url:**
   - [Bitly](https://bitly.com/) ([API](https://dev.bitly.com/v4_documentation.html))
* **temmie:**
   - [UNDERTALE](https://undertale.com/) (Original Game)
* **yoda:**
   - [The Yoda-Speak Generator](http://www.yodaspeak.co.uk/index.php) (API)
* **zalgo:**
   - [clux](https://github.com/clux) ([Zalgo Character Data](https://github.com/clux/zalgolize/blob/master/zalgo.js#L3-L21))
* **currency:**
   - [Fawaz Ahmed](https://github.com/fawazahmed0) ([API](https://github.com/fawazahmed0/exchange-api))
* **final-grade:**
   - [RogerHub Final Grade Calculator](https://rogerhub.com/final-grade-calculator/) (Concept, Code)
* **gravity:**
   - [NASA](https://www.nasa.gov/) ([Planet Gravity Data](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html))
* **math:**
   - [mathjs](https://mathjs.org/) (Expression Parser)
* **units:**
   - [mathjs](https://mathjs.org/) (Expression Parser)
* **airhorn:**
   - [Discord](https://discord.com/) ([Airhorn Sounds](https://github.com/discord/airhornbot/tree/master/audio))
* **animalese:**
   - [Acedio](https://github.com/Acedio) ([Code, Sounds](https://github.com/Acedio/animalese.js))
   - [Nintendo](https://www.nintendo.com/) ([Original "Animal Crossing" Game](https://animal-crossing.com/))
* **dec-talk:**
   - [Digital Equipment Corporation](http://gordonbell.azurewebsites.net/digital/timeline/tmlnhome.htm) (Original DECTalk Software)
   - [NASA](https://www.nasa.gov/) ([Original "Moonbase Alpha" Game](https://store.steampowered.com/app/39000/Moonbase_Alpha/))
* **mindfulness:**
   - [InspiroBot](https://inspirobot.me/) (API)
* **play:**
   - [Google](https://www.google.com/) ([YouTube Data API](https://developers.google.com/youtube/v3/))
* **tts:**
   - [Google](https://www.google.com/) (Translate TTS API)
* **phone:**
   - [Tatsumaki](https://tatsumaki.xyz/) (Concept)
* **cleverbot:**
   - [Cleverbot](https://www.cleverbot.com/) ([API](https://www.cleverbot.com/api/))
