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
	        "i": "Tem",
	        "me": "Temmie",
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
	        "XD": "xd",
	        "but": "b-but",
	        "store": "TEM ShOP",
	        "restaurant": "TEM ShOP",
	        "shop": "TEM Shop",
	        "temmie": "Temmiy",
	        "sick": "hOlves",
	        "illness": "hOlves",
	        "ill": "hOlves",
	        "disease": "hOlves",
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
	        "muscles": "NOT COOT",
	        "aw": "awwAwa",
	        "yikes": "OMG!!!!!!",
	        "ah": "OMG!!!!!!",
	        "oh": "OMG!!!!!!",
	        "yipe": "OMG!!!!!!",
	        "wait": "OMG!!!!!!",
	        "yes": "YEE!!!!!!",
	        "no": "NO!!!!!!",
	        "person": "BARK",
	        "monster": "munster",
	        "monsters": "munsters",
	        "great": "TEM OUTTA TEM",
	        "awesome": "TEM OUTTA TEM",
	        "cool": "TEM OUTTA TEM",
	        "nice": "TEM OUTTA TEM",
	        "good": "TEM OUTTA TEM",
	        "walks": "vibrates",
	        "moves": "vibrates",
	        "sits": "vibrates",
	        "goes": "vibrates",
	        "runs": "vibrates intensely",
	        "climbs": "vibrates intensely",
	        "escapes": "vibrates intensely",
	        "normal": "Bob",
	        "hmm": "p...",
	        "okay": "OK",
	        "lol": "lel",
	        "enemy": "special enemy",
	        "villain": "special enemy",
	        "bad guy": "special enemy",
	        "badguy": "special enemy",
	        "school": "skool",
	        "um": "p...",
	        "elizabeth": "ebears",
	        "yeah": "yAYA",
	        "yea": "yAYA",
	        "uh-huh": "yAYA",
	        "vampire": "wampire",
	        "tired": "*dies*",
	        "exhausted": "*dies*",
	        "bored": "*dies*",
	        "annoyed": "*dies*",
	        "irritated": "*dies*",
	        "mad": "*dies*",
	        "sleepy": "*dies*",
	        "confused": "*dies*",
	        "house": "Tem Villag",
	        "home": "Tem Villag",
	        "apartment": "Tem Villag",
	        "world": "Undergroun",
	        "hotel": "MTT Resort",
	        "motel": "MTT Resort",
	        "inn": "MTT Resort",
	        "cash": "g",
	        "gold": "g",
	        "jewels": "g",
	        "aaron": "NOT COOT",
	        "boy": "tim",
	        "girl": "tem",
	        "we": "tems",
	        "you": "u",
	        "your": "ur",
	        "yours": "urs"
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