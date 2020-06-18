const Command = require('../../structures/Command');

module.exports = class AiVaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ai-vase',
			aliases: ['this-vase-does-not-exist', 'vessel', 'this-vessel-does-not-exist'],
			group: 'random-img',
			memberName: 'ai-vase',
			description: 'Responds with a randomly generated vase.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'This Vessel Does Not Exist',
					url: 'https://thisvesseldoesnotexist.com/#/',
					reason: 'API'
				}
			]
		});
	}

	run(msg) {
		const num = Math.floor(Math.random() * 20000) + 1;
		const padded = num.toString().padStart(7, '0');
		return msg.say(`AI-Generated Vase #${num}`, {
			files: [`http://thisvesseldoesnotexist.s3-website-us-west-2.amazonaws.com/public/v2/fakes/${padded}.jpg`]
		});
	}
};
