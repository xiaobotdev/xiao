const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
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
					url: 'https://www.usps.com/'
				}
			],
			args: [
				{
					key: 'id',
					label: 'tracking id',
					prompt: 'What is the tracking ID of the package you would like to track?',
					type: 'string',
					validate: id => /^[0-9]+$/.test(id)
				}
			]
		});
	}

	async run(msg, { id }) {
		try {
			const summary = await this.fetchSummary(id);
			if (!summary) return msg.say('A status update is not yet available on your package. Check back soon.');
			return msg.say(stripIndents`
				**Tracking info for ${id}:**
				${summary}
				More Info: https://tools.usps.com/go/TrackConfirmAction?tLabels=${id}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchSummary(id) {
		const { text } = await request
			.get('https://secure.shippingapis.com/ShippingApi.dll')
			.query({
				API: 'TrackV2',
				XML: `<TrackRequest USERID="${USPS_USERID}"><TrackID ID="${id}"></TrackID></TrackRequest>`
			});
		if (text.includes('<Number>-2147219283</Number>')) return null;
		if (text.includes('<Error>')) throw new Error(text.match(/<Description>(.+)<\/Description>/i)[1].trim());
		const summary = text.match(/<TrackSummary>(.+)<\/TrackSummary>/i)[1].trim();
		return summary;
	}
};
