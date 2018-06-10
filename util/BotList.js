const request = require('node-superfetch');
const { DISCORD_BOTS_TOKEN } = process.env;

class BotListUtil {
	static async discordBots(client) {
		try {
			const { body } = await request
				.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
				.set({ Authorization: DISCORD_BOTS_TOKEN })
				.send({ server_count: client.guilds.size });
			console.log('[DISCORD BOTS] Posted to Discord Bots.');
			return body;
		} catch (err) {
			console.error('[DISCORD BOTS] Failed to post to Discord Bots.', err);
			return err;
		}
	}
}

module.exports = BotListUtil;
