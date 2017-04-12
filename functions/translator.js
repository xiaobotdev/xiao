module.exports.wordTrans = (text, words) => {
    text = text.split(' ');
    let translation = [];
    for (let i = 0; i < text.length; i++) {
        const word = text[i].toLowerCase();
        const wordPuncStrip = word.replace(/[\[\\^$.|?*+()\]]/g, '');
        if (words[wordPuncStrip]) {
            const reg = new RegExp(wordPuncStrip, 'gi');
            translation.push(word.replace(reg, words[wordPuncStrip]));
        }
        else {
            translation.push(word);
        }
    }
    return translation.join(' ');
};

module.exports.letterTrans = (text, letters) => {
    text = text.split('');
    let translation = [];
    for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        if (letters[letter]) {
            translation.push(letters[letter]);
        }
        else {
            translation.push(letter);
        }
    }
    return translation.join('');
};
