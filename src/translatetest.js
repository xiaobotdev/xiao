var dictionary = {
	"cow": "moo",
	"cat": "meow"
};

function translateWord(word) {
	var wordTranslate = dictionary[word.toLowerCase()];
	if (wordTranslate === undefined) return word;
	else return applyCase(word, wordTranslate);
}

function applyCase(wordA, wordB) {
	if (wordA.length === 1 && wordB.length !== 1) return wordB;
	if (wordA === wordA.toUpperCase()) return wordB.toUpperCase();
	if (wordA === wordA.toLowerCase()) return wordB.toLowerCase();
	var firstChar = wordA.slice(0, 1);
	var otherChars = wordA.slice(1);
	if (firstChar === firstChar.toUpperCase() && otherChars === otherChars.toLowerCase()) {
		return wordB.slice(0, 1).toUpperCase() + wordB.slice(1).toLowerCase();
	}
	return wordB;
}

function isLetter(character) {
	if (character.search(/[a-zA-Z'-]/) === -1) return false;
	return true;
}

module.exports.dictionary = dictionary;

module.exports.translate = function (text) {
	var translatedText = "";
	var word = "";
	for (var i = 0; i < text.length; i += 1) {
		var character = text[i];
		if (isLetter(character)) {
			word += character;
		} else {
			if (word != "") {
				var wordTranslate = translateWord(word);
				translatedText += wordTranslate;
				word = "";
			}
			translatedText += character;
		}
	}

	if (word !== "") translatedText += translateWord(word);

	return translatedText;
};