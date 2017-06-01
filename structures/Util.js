class Util {
    static cleanXML(str) {
        return str
            .replace(/(<br \/>)/g, '')
            .replace(/(&#039;)/g, '\'')
            .replace(/(&mdash;)/g, '—')
            .replace(/(&#034;|&quot;)/g, '"')
            .replace(/(&#038;)/g, '&')
            .replace(/(\[i\]|\[\/i\])/g, '*');
    }
}

module.exports = Util;
