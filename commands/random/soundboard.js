const commando = require('discord.js-commando');
const sounds = require('./sounds.json');

module.exports = class SoundBoardCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'soundboard',
            aliases: [
                'sound',
                'play'
            ],
            group: 'random',
            memberName: 'soundboard',
            description: 'Plays a sound in your voice channel. (;soundboard cat)',
            details: "**Sounds:** Cat, Pikachu, Vader, Doh, It's a Trap, Mario Death, Pokemon Center, Dun Dun Dun, Spongebob, Ugly Barnacle, Woo Hoo, Space, GLaDOS Bird, Airhorn, Zelda Chest, Eat my Shorts, No This is Patrick, Wumbo",
            examples: [';soundboard cat'],
            guildOnly: true,
            args: [{
                key: 'sound',
                prompt: 'What sound do you want me to play?',
                type: 'string',
                validate: sound => {
                    if (sounds.avaliable[sound.toLowerCase()]) {
                        return true;
                    }
                    return 'Sound not found. Use `;help soundboard` to view a list of sounds.';
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'SPEAK', 'ADD_REACTIONS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(`:x: Error! Please be in a voice channel first!`);
        let soundToPlay = args.sound.toLowerCase();
        let alreadyConnected = await this.client.voiceConnections.get(voiceChannel.guild.id);
        if (alreadyConnected) {
            if (alreadyConnected.channel.id === voiceChannel.id) return message.channel.send(':x: Error! I am already playing a sound!');
            return message.channel.send(':x: Error! I am already playing a sound!');
        }
        let connection = await voiceChannel.join();
        let stream = sounds.paths[soundToPlay];
        let dispatcher = connection.playStream(stream);
        message.react('🔊');
        dispatcher.on('end', () => {
            message.react('✅');
            return voiceChannel.leave();
        });
    }
};
