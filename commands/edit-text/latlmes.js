const Command = require('../../structures/Command');

module.exports = class LatlmesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'latlmes',
			group: 'edit-text',
			memberName: 'latlmes',
			description: 'Creates a Latlmes fake link that redirects to a rickroll.',
			credit: [
				{
					name: 'Latlmes',
					url: 'https://www.latlmes.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'section',
					prompt: 'What section of the news should the link display?',
					type: 'string',
					max: 100,
					parse: query => encodeURIComponent(query.replaceAll(' ', '-').toLowerCase())
				},
				{
					key: 'query',
					prompt: 'What would you like the link to display as?',
					type: 'string',
					max: 500,
					parse: query => encodeURIComponent(query.replaceAll(' ', '-').toLowerCase())
				}
			]
		});
	}

	run(msg, { section, query }) {
		return msg.say(`http://www.latlmes.com/${section}/${query}-1`);
	}
};
