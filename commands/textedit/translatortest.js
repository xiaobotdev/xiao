const commando = require('discord.js-commando');

module.exports = class TranslatorCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'translatetest',
            group: 'util',
            memberName: 'translatetest',
            description: "A test for a custom translator.",
            examples: [";servers"]
        });
    }
	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);

        let dictionary = {
	        "cow": "moo",
	        "cat": "meow"
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
	    let translated = translator(thingToTranslate);
	    message.channel.send(translated);
    }
};