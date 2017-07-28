const snekfetch = require('snekfetch');
const { carbonKey, dbotsKey, dbotsOrgKey } = require('../config');

class Util {
	static cleanXML(str) {
		return str
			.replace(/(<br \/>)/g, '')
			.replace(/(&#039;)/g, '\'')
			.replace(/(&mdash;)/g, '—')
			.replace(/(&#034;|&quot;)/g, '"')
			.replace(/(&#038;)/g, '&')
			.replace(/(\[i\]|\[\/i\])/g, '*');
	}

	static dBots(count, id) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${id}/stats`)
			.set({ Authorization: dbotsKey })
			.send({ server_count: count })
			.then(() => console.log('[DBOTS] Successfully posted to Discord Bots.'))
			.catch(err => console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`));
	}

	static carbon(count) {
		snekfetch
			.post('https://www.carbonitex.net/discord/data/botdata.php')
			.send({
				key: carbonKey,
				servercount: count
			})
			.then(() => console.log('[CARBON] Successfully posted to Carbon.'))
			.catch(err => console.error(`[CARBON] Failed to post to Carbon. ${err}`));
	}

	static dBotsOrg(count, id) {
		snekfetch
			.post(`https://discordbots.org/api/bots/${id}/stats`)
			.set({ Authorization: dbotsOrgKey })
			.send({ server_count: count })
			.then(() => console.log('[DBOTSORG] Successfully posted to Discord Bots Org.'))
			.catch(err => console.error(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`));
	}

	static parseTopic(channels, setting, user) {
		const channelList = channels.filter(c => {
			const topic = c.topic || '';
			if (topic.includes(`<${setting}>`) && c.type === 'text' && c.permissionsFor(user).has('SEND_MESSAGES')) return true;
			return false;
		});
		if (!channelList) return false;
		return channelList;
	}

	static parseTopicMsg(topic, setting) {
		const regex = new RegExp(`<${setting}>.+</${setting}>`, 'gi');
		if (!regex.test(topic)) return '';
		const parsed = topic.match(regex)[0];
		const word = `<${setting}>`;
		return parsed.slice(word.length, parsed.length - (word.length + 1));
	}
}

module.exports = Util;
