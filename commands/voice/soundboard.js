const Command = require('../../framework/Command');
const path = require('path');
const { list, reactIfAble } = require('../../util/Util');
const sounds = require('../../assets/json/soundboard');
const soundsChoice = sounds.map(sound => sound[sound.length - 1].replace(/\.mp3$/, ''));

module.exports = class SoundboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundboard',
			aliases: ['sound'],
			group: 'voice',
			memberName: 'soundboard',
			description: 'Plays a sound in a voice channel.',
			details: `**Sounds:** ${soundsChoice.join(', ')}`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: '07th Expansion',
					url: 'http://07th-expansion.net/',
					reason: 'Nipah Sound'
				},
				{
					name: 'UncleKornicob',
					url: 'http://soundbible.com/',
					reason: 'Alarm Sound',
					reasonURL: 'http://soundbible.com/1787-Annoying-Alarm-Clock.html'
				},
				{
					name: 'Mike Koenig',
					url: 'http://soundbible.com/',
					reason: 'Rooster Sound',
					reasonURL: 'http://soundbible.com/1218-Rooster-Crow.html'
				},
				{
					name: 'Mike Koenig',
					url: 'http://soundbible.com/',
					reason: 'Cow Sound',
					reasonURL: 'http://soundbible.com/1778-Cow-Moo.html'
				},
				{
					name: 'Cam Martinez',
					url: 'http://soundbible.com/',
					reason: 'Car Crash Sound',
					reasonURL: 'http://soundbible.com/1757-Car-Brake-Crash.html'
				},
				{
					name: 'Orange Free Sounds',
					url: 'http://www.orangefreesounds.com/',
					reason: 'Dun Dun Dun Sound',
					reasonURL: 'http://www.orangefreesounds.com/dun-dun-dun-sound-effect-brass/'
				},
				{
					name: 'Apple',
					url: 'https://www.apple.com/',
					reason: 'Cat Sound'
				},
				{
					name: 'GRSites',
					url: 'http://www.grsites.com/',
					reason: 'Laugh Track Sound',
					reasonURL: 'http://www.grsites.com/archive/sounds/category/8/'
				},
				{
					name: 'Jeopardy',
					url: 'https://www.jeopardy.com/',
					reason: 'Jeopardy Sound'
				},
				{
					name: '4Kids',
					url: 'https://www.4kidsentertainmentinc.com/',
					reason: 'Who\'s That Pokémon Sound'
				},
				{
					name: 'Over the Green Fields',
					url: 'https://asianwiki.com/Over_the_Green_Fields',
					reason: 'Sad Violin Sound'
				},
				{
					name: 'Valve',
					url: 'https://www.valvesoftware.com/en/',
					reasonURL: 'http://www.thinkwithportals.com/',
					reason: 'Slow Clap Sound'
				},
				{
					name: 'Microsoft',
					url: 'https://www.microsoft.com/en-us',
					reason: 'Windows Start Up and Windows Error Sounds'
				},
				{
					name: 'Star Wars',
					url: 'https://www.starwars.com/',
					reason: 'Hello There Sound'
				},
				{
					name: 'Rockstar Games',
					url: 'https://www.rockstargames.com/',
					reason: 'Here We Go Again Sound'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Explosion Sound'
				}
			],
			args: [
				{
					key: 'sound',
					prompt: `What sound do you want to play? Either ${list(soundsChoice, 'or')}.`,
					type: 'string',
					validate: sound => {
						const choice = sound.toLowerCase().replaceAll(' ', '-');
						if (soundsChoice.includes(choice)) return true;
						return `You provided an invalid sound. Please choose either ${list(soundsChoice, 'or')}.`;
					},
					parse: sound => {
						const choice = sound.toLowerCase().replaceAll(' ', '-');
						return sounds.find(snd => snd.includes(`${choice}.mp3`));
					}
				}
			]
		});
	}

	async run(msg, { sound }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', ...sound));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}
};
