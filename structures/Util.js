const snekfetch = require('snekfetch');
const { promisify } = require('util');
const { DBOTS_KEY, DBOTSORG_KEY } = process.env;

class Util {
	static cleanXML(str) {
		return str
			.replace(/<br \/>/g, '')
			.replace(/&#039;/g, '\'')
			.replace(/&mdash;/g, '—')
			.replace(/(&#034;|&quot;)/g, '"')
			.replace(/&#038;/g, '&')
			.replace(/(\[i\]|\[\/i\])/g, '*');
	}

	static dBots(count, id) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${id}/stats`)
			.set({ Authorization: DBOTS_KEY })
			.send({ server_count: count })
			.then(() => console.log('[DBOTS] Successfully posted to Discord Bots.'))
			.catch(err => console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`));
	}

	static dBotsOrg(count, id) {
		snekfetch
			.post(`https://discordbots.org/api/bots/${id}/stats`)
			.set({ Authorization: DBOTSORG_KEY })
			.send({ server_count: count })
			.then(() => console.log('[DBOTSORG] Successfully posted to Discord Bots Org.'))
			.catch(err => console.error(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`));
	}

	static filterTopics(channels, setting) {
		return channels.filter(c => {
			if (c.type !== 'text' || !c.topic) return false;
			if (c.topic.includes(`<${setting}>`)) return true;
			return false;
		});
	}

	static parseTopic(topic, setting) {
		const regex = new RegExp(`<${setting}>.+</${setting}>`, 'gi');
		if (!regex.test(topic)) return '';
		const parsed = topic.match(regex)[0];
		const word = `<${setting}>`;
		return parsed.slice(word.length, parsed.length - (word.length + 1));
	}

	static wait(time) {
		return promisify(setTimeout)(time);
	}

	static shuffle(array) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	static list(arr, conj = 'and') {
		const { length } = arr;
		return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	}

	static filterPkmn(arr) {
		const filtered = arr.filter(entry => entry.language.name === 'en');
		return filtered[Math.floor(Math.random() * filtered.length)];
	}

	static duration(ms) {
		const sec = Math.floor((ms / 1000) % 60);
		const min = Math.floor((ms / (1000 * 60)) % 60);
		const hrs = Math.floor(ms / (1000 * 60 * 60));
		return {
			hours: hrs,
			minutes: min,
			seconds: sec,
			format: `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
		};
	}
}

module.exports = Util;
