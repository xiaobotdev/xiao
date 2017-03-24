const commando = require('discord.js-commando');

const memecodes = {
    "tenguy": "tenguy",
    "afraid": "afraid",
    "older": "older",
    "aag": "aag",
    "tried": "tried",
    "biw": "biw",
    "blb": "blb",
    "kermit": "kermit",
    "bd": "bd",
    "ch": "ch",
    "cbg": "cbg",
    "wonka": "wonka",
    "cb": "cb",
    "keanu": "keanu",
    "dsm": "dsm",
    "live": "live",
    "ants": "ants",
    "doge": "doge",
    "alwaysonbeat": "alwaysonbeat",
    "ermg": "ermg",
    "facepalm": "facepalm",
    "fwp": "fwp",
    "fa": "fa",
    "fbf": "fbf",
    "fry": "fry",
    "hipster": "hipster",
    "icanhas": "icanhas",
    "crazypills": "crazypills",
    "mw": "mw",
    "noidea": "noidea",
    "regret": "regret",
    "boat": "boat",
    "hagrid": "hagrid",
    "sohappy": "sohappy",
    "captain": "captain",
    "inigo": "inigo",
    "iw": "iw",
    "ackbar": "ackbar",
    "happening": "happening",
    "joker": "joker",
    "ive": "ive",
    "ll": "ll",
    "morpheus": "morpheus",
    "mb": "mb",
    "badchoice": "badchoice",
    "mmm": "mmm",
    "jetpack": "jetpack",
    "red": "red",
    "mordor": "mordor",
    "oprah": "oprah",
    "oag": "oag",
    "remembers": "remembers",
    "philosoraptor": "philosoraptor",
    "jw": "jw",
    "patrick": "patrick",
    "rollsafe": "rollsafe",
    "sad-obama": "sad-obama",
    "sad-clinton": "sad-clinton",
    "sadfrog": "sadfrog",
    "sad-bush": "sad-bush",
    "sad-biden": "sad-biden",
    "sad-boehner": "sad-boehner",
    "saltbae": "saltbae",
    "sarcasticbear": "sarcasticbear",
    "dwight": "dwight",
    "sb": "sb",
    "ss": "ss",
    "sf": "sf",
    "dodgson": "dodgson",
    "money": "money",
    "sohot": "sohot",
    "nice": "nice",
    "awesome-awkward": "awesome-awkward",
    "awesome": "awesome",
    "awkward-awesome": "awkward-awesome",
    "awkward": "awkward",
    "fetch": "fetch",
    "success": "success",
    "scc": "scc",
    "ski": "ski",
    "officespace": "officespace",
    "interesting": "interesting",
    "toohigh": "toohigh",
    "bs": "bs",
    "center": "center",
    "both": "both",
    "winter": "winter",
    "xy": "xy",
    "buzz": "buzz",
    "yodawg": "yodawg",
    "uno": "uno",
    "yallgot": "yallgot",
    "bad": "bad",
    "elf": "elf",
    "chosen": "chosen"
};

module.exports = class MemeCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'meme',
            aliases: [
                'memegen'
            ],
            group: 'imageedit',
            memberName: 'meme',
            description: "Sends a Meme with text of your choice, and a background of your choice. Split first and second lines with a | (;meme facepalm I can't even | comprehend this)",
            examples: [";meme facepalm I can't even | comprehend this", ";meme list"]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let [type] = message.content.toLowerCase().split(" ").slice(1);
        if (type === "list") {
            message.channel.send("**Type Codes:** tenguy, afraid, older, aag, tried, biw, blb, kermit, bd, ch, cbg, wonka, cb, keanu, dsm, live, ants, doge, alwaysonbeat, ermg, facepalm, fwp, fa, fbf, fry, hipster, icanhas, crazypills, mw, noidea, regret, boat, hagrid, sohappy, captain, inigo, iw, ackbar, happening, joker, ive, ll, morpheus, mb, badchoice, mmm, jetpack, red, mordor, oprah, oag, remembers, philosoraptor, jw, patrick, rollsafe, sad-obama, sad-clinton, sadfrog, sad-bush, sad-biden, sad-boehner, saltbae, sarcasticbear, dwight, sb, ss, sf, dodgson, money, sohot, nice, awesome-awkward, awesome, awkward-awesome, awkward, fetch, success, scc, ski, officespace, interesting, toohigh, bs, center, both, winter, xy, buzz, yodawg, uno, yallgot, bad, elf, chosen");
        }
        else if (message.content.includes(" | ")) {
            if (message.content.split(" ").slice(1).join(" ").match(/^[a-zA-Z0-9|.,!?'-\s]+$/)) {
                let memeQuery = message.content.split(" ").slice(2).join("-").split('-|-');
                let toprow = memeQuery[0].split("?").join("~q");
                let bottomrow = memeQuery[1].split("?").join("~q");
                let link = `https://memegen.link/${type}/${toprow}/${bottomrow}.jpg`;
                if (bottomrow.length > 100) {
                    message.channel.send(":x: Error! Bottom text is over 100 characters!");
                }
                else if (toprow.length > 100) {
                    message.channel.send(":x: Error! Top text is over 100 characters!");
                }
                else {
                    if (memecodes[type]) {
                        try {
                            message.channel.sendFile(link);
                        }
                        catch (err) {
                            message.channel.send(":x: An Error Occurred! Please try again later!");
                        }
                    }
                    else {
                        message.channel.send(":x: Error! Meme type not found! Use `;meme list` to view of list of meme codes!");
                    }
                }
            }
            else {
                message.channel.send(":x: Error! Only letters, numbers, periods, commas, apostrophes, exclamation points, and question marks are allowed!");
            }
        }
        else {
            message.channel.send(":x: Split your two choices with a ' | '!");
        }
    }
};
