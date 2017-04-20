const { Command } = require('discord.js-commando');
const songs = require('./songs.json');

module.exports = class VocaloidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vocaloid',
            aliases: [
                'vocaloidsong'
            ],
            group: 'randomimg',
            memberName: 'vocaloid',
            description: 'Sends a random VOCALOID song. (x;vocaloid)',
            examples: ['x;vocaloid']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const song = songs[Math.floor(Math.random() * songs.length)];
        return message.say(song);
    }
};
