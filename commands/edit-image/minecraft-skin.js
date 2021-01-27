const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const types = ['face', 'front', 'frontfull', 'head', 'bust', 'full', 'skin'];

module.exports = class MinecraftSkinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'minecraft-skin',
			aliases: ['mc-skin'],
			group: 'edit-image',
			memberName: 'minecraft-skin',
			description: 'Sends the Minecraft skin for a user.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Mojang',
					url: 'https://www.mojang.com/',
					reason: 'API, Original "Minecraft" Game',
					reasonURL: 'https://wiki.vg/Mojang_API'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to get the skin of?',
					type: 'string',
					parse: user => encodeURIComponent(user)
				},
				{
					key: 'type',
					prompt: `What type should the skin be rendered in? Either ${list(types, 'or')}.`,
					type: 'string',
					default: 'full',
					validate: type => {
						if (types.includes(type.toLowerCase())) return true;
						return `Invalid type, please enter either ${list(types, 'or')}.`;
					},
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	async run(msg, { user, type }) {
		try {
			const search = await request.get(`https://api.mojang.com/users/profiles/minecraft/${user}`);
			if (search.status === 204) return msg.say('Could not find any results.');
			return msg.say({ files: [`https://visage.surgeplay.com/${type}/512/${search.body.id}.png`] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
