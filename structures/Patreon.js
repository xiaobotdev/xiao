const request = require('node-superfetch');
const fs = require('fs');
const { PATREON_ACCESS_TOKEN, PATREON_CAMPAIGN_ID } = process.env;

module.exports = class Patreon {
	constructor(accessToken, campaignID) {
		this.patrons = [];
		this.forced = [];
		this.accessToken = accessToken || PATREON_ACCESS_TOKEN;
		this.campignID = campaignID || PATREON_CAMPAIGN_ID;
	}

	isPatron(id) {
		return this.patrons.includes(id) || this.forced.includes(id);
	}

	async fetchPatrons() {
		if (!this.accessToken || !this.campignID) return null;
		const { text } = await request
			.get(`https://www.patreon.com/api/oauth2/v2/campaigns/${PATREON_CAMPAIGN_ID}/members`)
			.set({ Authorization: `Bearer ${PATREON_ACCESS_TOKEN}` })
			.query({
				include: 'currently_entitled_tiers,user',
				'fields[user]': 'social_connections',
				'fields[member]': 'patron_status'
			});
		const body = JSON.parse(text);
		const patrons = [];
		for (const patron of body.data) {
			if (patron.attributes.patron_status !== 'active_patron') continue;
			const socials = body.included.find(user => user.id === patron.relationships.user.data.id)
				?.attributes?.social_connections;
			if (!socials || !socials.discord || !socials.discord.user_id) continue;
			patrons.push(socials.discord.user_id);
		}
		this.patrons = patrons;
		return this.patrons;
	}

	importForced() {
		const read = fs.readFileSync(path.join(__dirname, '..', 'patreon.json'), { encoding: 'utf8' });
		const file = JSON.parse(read);
		if (!Array.isArray(file)) return null;
		for (const id of file) {
			if (typeof id !== 'string') continue;
			if (this.forced.includes(id)) continue;
			this.forced.push(id);
		}
		return file;
	}

	exportForced() {
		let text = '[\n	';
		if (this.forced.length) {
			for (const id of this.forced) {
				text += `"${id}",\n	`;
			}
			text = text.slice(0, -3);
		}
		text += '\n]\n';
		const buf = Buffer.from(text);
		fs.writeFileSync(path.join(__dirname, '..', 'patreon.json'), buf, { encoding: 'utf8' });
		return buf;
	}
};
