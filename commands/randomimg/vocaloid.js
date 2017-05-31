const Command = require('../../structures/Command');
const songs = require('../../assets/json/vocaloid');

module.exports = class VocaloidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vocaloid',
            group: 'randomimg',
            memberName: 'vocaloid',
            description: 'Sends a random VOCALOID song.'
        });
    }

    run(msg) {
        const song = songs[Math.floor(Math.random() * songs.length)];
        return msg.say(song);
    }
};
