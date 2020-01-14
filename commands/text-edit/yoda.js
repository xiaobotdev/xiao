const Command = require('../../structures/Command');
const soap = require('soap');

module.exports = class YodaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoda',
			aliases: ['yoda-speak'],
			group: 'text-edit',
			memberName: 'yoda',
			description: 'Converts text to Yoda speak.',
			credit: [
				{
					name: 'The Yoda-Speak Generator',
					url: 'https://www.yodaspeak.co.uk/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'sentence',
					prompt: 'What sentence would you like to convert to Yoda speak?',
					type: 'string',
					max: 500
				}
			]
		});

		this.soapClient = null;
	}

	async run(msg, { sentence }) {
		try {
			if (!this.soapClient) await this.setUpClient();
			const response = await this.soapClient.yodaTalkAsync({ inputText: sentence });
			const text = response[0].return;
			if (!text) return msg.reply('Empty, this message is. Try again later, you must.');
			return msg.say(text);
		} catch (err) {
			return msg.reply(`Being a jerk again, Yoda is: \`${err.message}\`. Try again later, you must.`);
		}
	}

	async setUpClient() {
		this.soapClient = await soap.createClientAsync('http://www.yodaspeak.co.uk/webservice/yodatalk.php?wsdl');
		return this.soapClient;
	}
};
