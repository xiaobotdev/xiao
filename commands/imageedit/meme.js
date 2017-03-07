const commando = require('discord.js-commando');
const memecodes = require('./memecodes.json');

class MemeCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'meme', 
            group: 'imageedit',
            memberName: 'meme',
            description: "Sends a Meme with text of your choice, and a background of your choice. Split first and second lines with a | (;meme facepalm I can't even | comprehend this)",
            examples: [';cat']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        let [type] = message.content.toLowerCase().split(" ").slice(1);
        if(type === "list") {
            message.channel.sendMessage("**Type Codes:** tenguy, afraid, older, aag, tried, biw, blb, kermit, bd, ch, cbg, wonka, cb, keanu, dsm, live, ants, doge, alwaysonbeat, ermg, facepalm, fwp, fa, fbf, fry, hipster, icanhas, crazypills, mw, noidea, regret, boat, hagrid, sohappy, captain, inigo, iw, ackbar, happening, joker, ive, ll, morpheus, mb, badchoice, mmm, jetpack, red, mordor, oprah, oag, remembers, philosoraptor, jw, patrick, rollsafe, sad-obama, sad-clinton, sadfrog, sad-bush, sad-biden, sad-boehner, saltbae, sarcasticbear, dwight, sb, ss, sf, dodgson, money, sohot, nice, awesome-awkward, awesome, awkward-awesome, awkward, fetch, success, scc, ski, officespace, interesting, toohigh, bs, center, both, winter, xy, buzz, yodawg, uno, yallgot, bad, elf, chosen");
        } else if(message.content.includes("|")) {
            if(message.content.split(" ").slice(1).join(" ").match(/^[a-zA-Z0-9|\s]+$/)) {
                let bottomrow = message.content.toLowerCase().split("|").slice(1).join("-");
                let toprow = " " + message.content.toLowerCase().replace(bottomrow, "").split(" ").slice(2).join("-");
                toprow = toprow.replace("|", "");
                let link = "https://memegen.link/" + type + "/" + toprow + "/" + bottomrow + ".jpg";
                if(type !== "") {
                    if(memecodes.memecodes[type]) { 
                        message.channel.sendFile(link);
                    } else {
                        message.channel.sendMessage(":x: Error! Meme type not found!");
                    }
                } else {
                    message.channel.sendMessage(":x: Error! No meme type set! (View list with ;meme list)");
                }
            } else {
                message.channel.sendMessage(":x: Error! Only Letters and Numbers are allowed!");
            }
        } else {
            message.channel.sendMessage(":x: Split your two choices with a ' | '!");
        }
    }
}

module.exports = MemeCommand;