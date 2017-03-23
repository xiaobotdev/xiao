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
            examples: [';soundboard cat']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['CONNECT', 'SPEAK', 'ADD_REACTIONS'])) {
                return message.channel.send(':x: Error! In order to do this command, you must give me the permissions to "Connect" and "Speak", as well as the permission to Add Reactions!');
            }
            else {
                let voiceChannel = message.member.voiceChannel;
                if (!voiceChannel) {
                    return message.channel.send(`:x: Error! Please be in a voice channel first!`);
                }
                else {
                    let soundToPlay = message.content.toLowerCase().split(" ").slice(1).join(" ");
                    if (!soundToPlay) {
                        return message.channel.send(':x: Error! No sound set. Please use ;soundboard list to see a list of sounds you can play.');
                    }
                    else if (soundToPlay === 'list') {
                        return message.channel.send("**Available Sounds:** Cat, Pikachu, Vader, Doh, It's a Trap, Mario Death, Pokemon Center, Dun Dun Dun, Spongebob, Ugly Barnacle, Woo Hoo, Space, GLaDOS Bird, Airhorn, Zelda Chest, Eat my Shorts, No This is Patrick, Wumbo");
                    }
                    else if (soundToPlay === sounds.avaliable[soundToPlay]) {
                        let alreadyConnected = await this.client.voiceConnections.get(voiceChannel.guild.id);
                        if (alreadyConnected) {
                            if (alreadyConnected.channel.id === voiceChannel.id) {
                                return message.channel.send(':x: Error! I am already playing a sound!');
                            }
                            else {
                                return message.channel.send(':x: Error! I am already playing a sound!');
                            }
                        }
                        else {
                            await voiceChannel.join().then(connection => {
                                let stream = sounds.paths[soundToPlay];
                                let dispatcher = connection.playStream(stream);
                                message.react('🔊');
                                dispatcher.on('end', () => {
                                    message.react('✅');
                                    return voiceChannel.leave();
                                });
                            });
                        }
                    }
                    else {
                        return message.channel.send(':x: Error! Sound not found! Use `;soundboard list` to see a list of sounds you can play.');
                    }
                }
            }
        }
        else {
            return message.channel.send(':x: This is a DM!');
        }
    }
};
