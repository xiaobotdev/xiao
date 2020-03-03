const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { homepage } = require('../../package');
const { USPS_USERID } = process.env;

module.exports = class USPSTrackingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'usps-tracking',
			aliases: ['usps-track', 'usps'],
			group: 'search',
			memberName: 'usps-tracking',
			description: 'Gets tracking information for a package shipped via USPS.',
			credit: [
				{
					name: 'USPS',
					url: 'https://www.usps.com/',
					reason: 'API',
					reasonURL: 'https://www.usps.com/business/web-tools-apis/'
				}
			],
			args: [
				{
					key: 'id',
					label: 'tracking id',
					prompt: 'What is the tracking ID of the package you would like to track?',
					type: 'string',
					validate: id => /^[0-9A-Z]+$/i.test(id)
				}
			]
		});
	}

	async run(msg, { id }) {
		try {
			const { expected, summary } = await this.fetchStatus(id);
			if (!summary) return msg.say('A status update is not yet available on your package. Check back soon.');
			return msg.say(stripIndents`
				**Tracking info for ${id}:**
				${summary}

				Expected Delivery by: ${expected || 'N/A'}
				More Info: <https://tools.usps.com/go/TrackConfirmAction?tLabels=${id}>
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchStatus(id) {
		const { text } = await request
			.get('https://secure.shippingapis.com/ShippingApi.dll')
			.query({
				API: 'TrackV2',
				XML: stripIndents`
					<TrackFieldRequest USERID="${USPS_USERID}">
					<Revision>1</Revision>
					<ClientIp>127.0.0.1</ClientIp>
					<SourceId>${homepage}</SourceId>
						<TrackID ID="${id}">
						</TrackID>
					</TrackFieldRequest>
				`
			});
		if (text.includes('<Number>-2147219283</Number>')) return null;
		if (text.includes('<Error>')) throw new Error(text.match(/<Description>(.+)<\/Description>/i)[1].trim());
		const summary = text.match(/<StatusSummary>(.+)<\/StatusSummary>/i);
		const expected = text.match(/<ExpectedDeliveryDate>(.+)<\/ExpectedDeliveryDate>/i);
		return {
			summary: summary ? summary[1].trim() : null,
			expected: expected ? expected[1].trim() : null
		};
	}
};
