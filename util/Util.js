const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea'];
const no = ['no', 'n', 'nah', 'nope'];

class Util {
	static wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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
		const len = arr.length;
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
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
			format: () => `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
		};
	}

	static pad(text, prefix) {
		return `${prefix.slice(text.length)}${text}`;
	}

	static randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static cleanXML(text) {
		return text
			.replace(/<br \/>/g, '')
			.replace(/&apos;|&#0?39;/g, '\'')
			.replace(/&mdash;/g, '—')
			.replace(/&ndash;/g, '–')
			.replace(/&quot;|&#0?34;/g, '"')
			.replace(/&lt;|&#0?60;/g, '<')
			.replace(/&gt;|&#0?62;/g, '>')
			.replace(/&amp;|&#0?38;/g, '&')
			.replace(/&eacute;/g, 'é')
			.replace(/\[i\]|\[\/i\]/g, '*');
	}

	static async awaitPlayers(msg, max, min, { text = 'join game', time = 30000 } = {}) {
		const joined = [];
		joined.push(msg.author.id);
		const filter = res => {
			if (msg.author.bot) return false;
			if (joined.includes(res.author.id)) return false;
			if (res.content.toLowerCase() !== text.toLowerCase()) return false;
			joined.push(res.author.id);
			return true;
		};
		const verify = await msg.channel.awaitMessages(filter, { max, time });
		verify.set(msg.id, msg);
		if (verify.size < min) return false;
		return verify.map(message => message.author);
	}

	static async verify(channel, user, time = 30000) {
		const filter = res => {
			const value = res.content.toLowerCase();
			return res.author.id === user.id && (yes.includes(value) || no.includes(value));
		};
		const verify = await channel.awaitMessages(filter, {
			max: 1,
			time
		});
		if (!verify.size) return 0;
		const choice = verify.first().content.toLowerCase();
		if (yes.includes(choice)) return true;
		if (no.includes(choice)) return false;
		return false;
	}
}

module.exports = Util;
