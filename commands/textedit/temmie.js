const commando = require('discord.js-commando');

module.exports = class TemmieCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'temmie',
            group: 'textedit',
            memberName: 'temmie',
            description: "Translate text to Temmie speak. (;temmie I am Temmie)",
            examples: [";temmie I am Temmie."]
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);

        let dictionary = {
	        "i": "tem",
	        "hi": "hoi",
	        "that": "dat",
	        "that's": "dat",
	        "hello": "hoi",
	        "me": "temmie",
	        "goodbye": "boi",
	        "bye": "boi",
	        "later": "boi",
	        "college": "colleg",
	        "money": "muns",
	        "food": "tem flakes",
	        "snack": "tem flakes",
	        "snacks": "tem flakes",
	        "meal": "tem flakes",
	        "meals": "tem flakes",
	        "human": "hooman",
	        "chocolate": "choco",
	        "cute": "coot",
	        "allergic": "allergics",
	        "allergy": "allergics",
	        "do": "dos",
	        "does": "dos",
	        "what": "ppppppppp...",
	        "who": "ppppppppp...",
	        "when": "ppppppppp...",
	        "why": "ppppppppp...",
	        "where": "ppppppppp...",
	        "how": "ppppppppp...",
	        "xd": "xd",
	        "but": "b-but",
	        "store": "tem shop",
	        "restaurant": "tem shop",
	        "shop": "tem shop",
	        "temmie": "temmiy",
	        "sick": "holves",
	        "illness": "holves",
	        "ill": "holves",
	        "disease": "holves",
	        "cat": "tem",
	        "dog": 'tem',
	        "hugs": "pets",
	        "pats": "pets",
	        "waves": "pets",
	        "high-fives": "pets",
	        "fistbumps": "pets",
	        "hug": "pet",
	        "pat": "pet",
	        "wave": "pet",
	        "high-five": "pet",
	        "fistbump": "pet",
	        "hungry": "hungr",
	        "muscles": "not coot",
	        "aw": "awwawa",
	        "yikes": "omg!!!!!!",
	        "ah": "omg!!!!!!",
	        "oh": "omg!!!!!!",
	        "yipe": "omg!!!!!!",
	        "wait": "omg!!!!!!",
	        "yes": "yee!!!!!!",
	        "no": "no!!!!!!",
	        "person": "bark",
	        "monster": "munster",
	        "monsters": "munsters",
	        "great": "tem outta tem",
	        "awesome": "tem outta tem",
	        "cool": "tem outta tem",
	        "nice": "tem outta tem",
	        "good": "tem outta tem",
	        "walks": "vibrates",
	        "moves": "vibrates",
	        "sits": "vibrates",
	        "goes": "vibrates",
	        "runs": "vibrates intensely",
	        "climbs": "vibrates intensely",
	        "escapes": "vibrates intensely",
	        "normal": "bob",
	        "hmm": "p...",
	        "okay": "ok",
	        "lol": "lel",
	        "enemy": "special enemy",
	        "villain": "special enemy",
	        "bad guy": "special enemy",
	        "badguy": "special enemy",
	        "school": "skool",
	        "um": "p...",
	        "elizabeth": "ebears",
	        "yeah": "yaya",
	        "yea": "yaya",
	        "uh-huh": "yaya",
	        "vampire": "wampire",
	        "tired": "*dies*",
	        "exhausted": "*dies*",
	        "bored": "*dies*",
	        "annoyed": "*dies*",
	        "irritated": "*dies*",
	        "mad": "*dies*",
	        "sleepy": "*dies*",
	        "confused": "*dies*",
	        "house": "tem villag",
	        "home": "tem villag",
	        "apartment": "tem villag",
	        "world": "undergroun",
	        "hotel": "mtt resort",
	        "motel": "mtt resort",
	        "inn": "mtt resort",
	        "cash": "g",
	        "gold": "g",
	        "jewels": "g",
	        "aaron": "not coot",
	        "boy": "tim",
	        "girl": "tem",
	        "we": "tems",
	        "you": "u",
	        "your": "ur",
	        "yours": "urs",
	        "there": "dere"
        };

        function translateWord(word) {
	        let wordTranslate = dictionary[word.toLowerCase()];
	        if (wordTranslate === undefined) return word;
	        else return applyCase(word, wordTranslate);
        }

        function applyCase(wordA, wordB) {
	        if (wordA.length === 1 && wordB.length !== 1) return wordB;
	        if (wordA === wordA.toUpperCase()) return wordB.toUpperCase();
        	if (wordA === wordA.toLowerCase()) return wordB.toLowerCase();
	        let firstChar = wordA.slice(0, 1);
	        let otherChars = wordA.slice(1);
	        if (firstChar === firstChar.toUpperCase() && otherChars === otherChars.toLowerCase()) {
		        return wordB.slice(0, 1).toUpperCase() + wordB.slice(1).toLowerCase();
	        }
	        return wordB;
        }

        function isLetter(character) {
	        if (character.search(/[a-zA-Z'-]/) === -1) return false;
	        return true;
        }

        const translator = function (text) {
        	let translatedText = "";
	        let word = "";
	        for (let i = 0; i < text.length; i += 1) {
		        let character = text[i];
		        if (isLetter(character)) {
			        word += character;
		        } else {
			        if (word != "") {
				        let wordTranslate = translateWord(word);
				        translatedText += wordTranslate;
				        word = "";
			        }
			        translatedText += character;
		        }
	        }

	        if (word !== "") translatedText += translateWord(word);

	        return translatedText;
        };

	    let thingToTranslate = message.content.split(" ").slice(1).join(" ");
	    let temspeak = translator(thingToTranslate);
	    let noing = temspeak.split("ing").join("in");
	    let noExclaim = noing.split("!").join("!!!!111!11!1!!!1!!!1111!");
	    let noApostrophe = noExclaim.split("'").join("");
	    let translated = noApostrophe;
	    message.channel.send(translated);
    }
};