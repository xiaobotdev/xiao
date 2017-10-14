const { ShardingManager } = require('discord.js');
const path = require('path');
const { postStats } = require('./util/Util');
const { TOKEN } = process.env;
const manager = new ShardingManager(path.join(__dirname, 'XiaoBot.js'), { token: TOKEN });
manager.spawn(undefined, 1000);

setInterval(async () => {
	if (!manager.shards.has(0)) return;
	try {
		const guilds = await manager.fetchClientValues('guilds.size');
		const count = guilds.reduce((prev, val) => prev + val, 0);
		await postStats(count, await manager.shards.get(0).fetchClientValue('user.id'));
	} catch (err) {
		console.error(`[STATS] Failed to post stats. ${err}`);
	}
}, 300000);
