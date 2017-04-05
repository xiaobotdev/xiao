const commando = require('discord.js-commando');
const sounds = ['cat', 'pikachu', 'vader', 'doh', 'it\'s a trap', 'mario death', 'pokemon center', 'dun dun dun', 'spongebob', 'ugly barnacle', 'woo hoo', 'space', 'glados bird', 'airhorn', 'zelda chest', 'eat my shorts', 'no this is patrick', 'wumbo'];
const paths = {
    "cat": "./sounds/cat.mp3",
    "pikachu": "./sounds/pikachu.mp3",
    "vader": "./sounds/vader.mp3",
    "doh": "./sounds/doh.mp3",
    "it's a trap": "./sounds/its-a-trap.mp3",
    "mario death": "./sounds/mario-death.mp3",
    "pokemon center": "./sounds/pokemon-center.mp3",
    "dun dun dun": "./sounds/dun-dun-dun.mp3",
    "spongebob": "./sounds/spongebob.mp3",
    "ugly barnacle": "./sounds/ugly-barnacle.mp3",
    "woo hoo": "./sounds/woohoo.mp3",
    "space": "./sounds/space.mp3",
    "glados bird": "./sounds/glados-bird.mp3",
    "airhorn": "./sounds/airhorn.mp3",
    "zelda chest": "./sounds/zelda-chest.mp3",
    "eat my shorts": "./sounds/eat-my-shorts.mp3",
    "no this is patrick": "./sounds/no-this-is-patrick.mp3",
    "wumbo": "./sounds/wumbo.mp3"
};

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
            details: '**Sounds:** Cat, Pikachu, Vader, Doh, It\'s a Trap, Mario Death, Pokemon Center, Dun Dun Dun, Spongebob, Ugly Barnacle, Woo Hoo, Space, GLaDOS Bird, Airhorn, Zelda Chest, Eat my Shorts, No This is Patrick, Wumbo',
            examples: [';soundboard cat'],
            guildOnly: true,
            args: [{
                key: 'sound',
                prompt: 'What sound do you want me to play?',
                type: 'string',
                validate: sound => {
                    if (sounds.some(soundArray => sound.toLowerCase() === soundArray)) {
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
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.say(`:x: Error! Please be in a voice channel first!`);
        const soundToPlay = args.sound.toLowerCase();
        const alreadyConnected = await this.client.voiceConnections.get(voiceChannel.guild.id);
        if (alreadyConnected) {
            if (alreadyConnected.channel.id === voiceChannel.id) return message.say(':x: Error! I am already playing a sound!');
            return message.say(':x: Error! I am already playing a sound!');
        }
        const connection = await voiceChannel.join();
        const stream = paths[soundToPlay];
        const dispatcher = connection.playStream(stream);
        message.react('🔊');
        dispatcher.on('end', () => {
            message.react('✅');
            return voiceChannel.leave();
        });
    }
};
