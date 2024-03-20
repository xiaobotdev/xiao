const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = class VoiceDispatcher {
	constructor(channel) {
		this.channel = channel;
		this.player = createAudioPlayer();
		getVoiceConnection(channel.guild.id).subscribe(this.player);
	}

	play(content) {
		this.player.stop();
		const resource = createAudioResource(content);
		this.player.play(resource);
		this.player.once(AudioPlayerStatus.Idle, () => this.stop());
		this.player.once('error', () => this.stop());
		return this.player;
	}

	stop() {
		return this.player.stop(true);
	}

	leave() {
		this.client.dispatchers.delete(this.guild.id);
		return this.connection.destroy();
	}

	pause() {
		return this.player.pause();
	}

	unpause() {
		return this.player.unpause();
	}

	get connection() {
		return getVoiceConnection(this.guild.id);
	}

	get guild() {
		return this.channel.guild;
	}

	get client() {
		return this.channel.client;
	}

	get canPlay() {
		return this.player.state === AudioPlayerStatus.Idle;
	}
};
