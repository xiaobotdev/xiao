const { Command } = require('discord.js-commando');
const { names, paths } = require('../../assets/json/soundboard');
const path = require('path');

module.exports = class SoundboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundboard',
            group: 'random',
            memberName: 'soundboard',
            description: 'Plays a sound in your voice channel.',
            details: `**Sounds:** ${names.join(', ')}`,
            guildOnly: true,
            args: [
                {
                    key: 'sound',
                    prompt: 'What sound would you like to play?',
                    type: 'string',
                    validate: sound => {
                        if (names.includes(sound.toLowerCase())) return true;
                        return 'Invalid Sound. Use `help soundboard` for a list of sounds.';
                    },
                    parse: sound => sound.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('CONNECT'))
            return msg.say('This Command requires the `Connect` Permission.');
        if (!msg.channel.permissionsFor(this.client.user).has('SPEAK'))
            return msg.say('This Command requires the `Speak` Permission.');
        if (!msg.channel.permissionsFor(this.client.user).has('ADD_REACTIONS'))
            return msg.say('This Command requires the `Add Reactions` Permission.');
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.say('Please enter a Voice Channel first.');
        const alreadyConnected = this.client.voiceConnections.get(voiceChannel.guild.id);
        if (alreadyConnected) return msg.say('I am already playing a sound.');
        const { sound } = args;
        try {
            const connection = await voiceChannel.join();
            msg.react('🔊');
            const dispatcher = connection.playStream(path.join(__dirname, '..', '..', 'assets', 'sounds', paths[sound]));
            dispatcher.on('end', () => {
                voiceChannel.leave();
                msg.react('✅');
                return null;
            });
        } catch (err) {
            return msg.say(err);
        }
    }
};
