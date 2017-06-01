const Command = require('../../structures/Command');
const { names, paths } = require('../../assets/json/soundboard');
const path = require('path');

module.exports = class SoundboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundboard',
            aliases: ['sound'],
            group: 'random',
            memberName: 'soundboard',
            description: 'Plays a sound in your voice channel.',
            details: `**Sounds:** ${names.join(', ')}`,
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 15
            },
            clientPermissions: ['ADD_REACTIONS'],
            args: [
                {
                    key: 'sound',
                    prompt: 'What sound would you like to play?',
                    type: 'string',
                    validate: (sound) => {
                        if (names.includes(sound.toLowerCase())) return true;
                        else return 'Invalid Sound. Use `help soundboard` for a list of sounds.';
                    },
                    parse: (sound) => sound.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.say('Please enter a Voice Channel first.');
        if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK'])) {
            return msg.say('Missing the `CONNECT` or `SPEAK` Permission for the Voice Channel.');
        }
        if (!voiceChannel.joinable) return msg.say('This Voice Channel is not joinable.');
        if (this.client.voiceConnections.get(voiceChannel.guild.id)) return msg.say('I am already playing a sound.');
        const { sound } = args;
        const connection = await voiceChannel.join();
        msg.react('🔊');
        const dispatcher = connection.playFile(path.join(__dirname, '..', '..', 'assets', 'sounds', paths[sound]));
        dispatcher.on('end', () => {
            voiceChannel.leave();
            msg.react('✅');
        });
        return null;
    }
};
