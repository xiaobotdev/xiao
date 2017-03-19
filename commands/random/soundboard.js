const commando = require('discord.js-commando');
const sounds = require('./sounds.json');

class SoundBoardCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'soundboard', 
            group: 'random',
            memberName: 'soundboard',
            description: 'Plays a sound in your voice channel. (;soundboard cat)',
            examples: [';soundboard cat']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['CONNECT', 'SPEAK'])) {
                message.channel.send(':x: Error! In order to do this command, you must give me the permissions to "Connect" and "Speak"!');
            } else {
                let voiceChannel = message.member.voiceChannel;
                if (!voiceChannel) {
	                return message.channel.send(`:x: Error! Please be in a voice channel first!`);
                }
	            let soundToPlay = message.content.toLowerCase().split(" ").slice(1).join(" ");
	            if(soundToPlay === "") {
		            message.channel.send(':x: Error! No sound set. Please use ;soundboard list to see a list of sounds you can play.');
	            } else if(soundToPlay === 'list') {
		            message.channel.send("**Available Sounds:** Cat, Pikachu, Vader, Doh, It's a Trap, Mario Death, Pokemon Center, Dun Dun Dun, Spongebob, Ugly Barnacle, Woo Hoo");
	            } else if(soundToPlay === sounds.avaliable[soundToPlay]) {
	                voiceChannel.join().then(connnection => {
		                let stream = sounds.paths[soundToPlay];
    	                let dispatcher = connnection.playStream(stream);
    	                dispatcher.on('end', () => {
        	                voiceChannel.leave();
    	                });
	                });
	            } else {
		            message.channel.send(':x: Error! Sound not found! Please use ;soundboard list to see a list of sounds you can play.');
	            }
            }
        }
    }
}

module.exports = SoundBoardCommand;