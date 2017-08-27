const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class AchievementCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'achievement',
			group: 'image-edit',
			memberName: 'achievement',
			description: 'Sends a Minecraft achievement with the text of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the achievement be?',
					type: 'string',
					validate: text => {
						if (text.length < 25) return true;
						return 'Please keep the text under 25 characters.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { text } = args;
		try {
			const { body } = await snekfetch
				.get('https://www.minecraftskinstealer.com/achievement/a.php')
				.query({
					i: 1,
					h: 'Achievement Get!',
					t: text
				});
			return msg.say({ files: [{ attachment: body, name: 'achievement.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

