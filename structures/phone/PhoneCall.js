const { stripIndents } = require('common-tags');
const { shorten, stripInvites, verify } = require('../../util/Util');

module.exports = class PhoneCall {
	constructor(client, origin, recipient, ownerOrigin) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = `${origin.id}:${recipient.id}`;
		this.origin = origin;
		this.recipient = recipient;
		this.active = false;
		this.timeout = null;
		this.ownerOrigin = ownerOrigin || false;
		this.cooldown = new Set();
		this.ratelimitMeters = new Map();
	}

	async start() {
		if (this.ownerOrigin) {
			await this.origin.send(`☎️ Admin call started with **${this.recipient.guild.name}**.`);
			await this.recipient.send(`☎️ An **ADMIN** call from **${this.origin.guild.name}** has begun.`);
		} else {
			await this.origin.send(`☎️ Calling **${this.recipient.guild.name}**...`);
			await this.recipient.send(`☎️ Incoming call from **${this.origin.guild.name}**. Pick up?`);
			const validation = await verify(this.recipient, null);
			if (!validation) {
				await this.hangup('declined', validation);
				return this;
			}
		}
		await this.accept();
		return this;
	}

	async accept() {
		this.active = true;
		this.setTimeout();
		if (this.ownerOrigin) return this;
		await this.origin.send(`☎️ **${this.recipient.guild.name}** picked up! Type \`hang up\` to hang up.`);
		await this.recipient.send(`☎️ Accepted call from **${this.origin.guild.name}**. Type \`hang up\` to hang up.`);
		return this;
	}

	async hangup(nonQuitter, validation) {
		this.active = false;
		clearTimeout(this.timeout);
		if (nonQuitter === 'time') {
			await this.origin.send('☎️ Call ended due to inactivity.');
			await this.recipient.send('☎️ Call ended due to inactivity.');
		} else if (nonQuitter === 'declined') {
			const canVoicemail = this.recipient.topic && !this.recipient.topic.includes('<xiao:phone:no-voicemail>');
			const recipientMsg = validation === 0
				? canVoicemail ? 'Sent to voicemail.' : 'Missed the call.'
				: 'Declined the call.';
			await this.recipient.send(`☎️ ${recipientMsg}`);
			if (validation === 0 && canVoicemail) {
				await this.origin.send(`☎️ **${this.recipient.guild.name}** didn't answer... Leave a voicemail?`);
				const voicemailValidation = await verify(this.origin, null);
				if (voicemailValidation) {
					await this.origin.send('☎️ Please leave your message (max 280 characters) after the beep. _Beep_.');
					const voicemail = await this.origin.awaitMessages(res => res.content && res.content.length <= 280, {
						time: 30000,
						max: 1
					});
					if (voicemail.size) {
						const voicemailMsg = voicemail.first();
						await this.sendVoicemail(this.recipient, voicemailMsg);
						await this.origin.send('☎️ Your voicemail has been left.');
					} else {
						await this.origin.send('☎️ No voicemail will be left.');
					}
				} else {
					await this.origin.send('☎️ No voicemail will be left.');
				}
			} else {
				const originMsg = validation === 0 ? 'didn\'t answer...' : 'declined the call...';
				await this.origin.send(`☎️ **${this.recipient.guild.name}** ${originMsg}`);
			}
		} else {
			const quitter = nonQuitter.id === this.origin.id ? this.recipient : this.origin;
			await nonQuitter.send(`☎️ **${quitter.guild.name}** hung up.`);
			await quitter.send('☎️ Hung up.');
		}
		this.client.phone.delete(this.id);
		return this;
	}

	send(channel, msg, hasText, hasImage, hasEmbed) {
		if (msg.content && msg.content.toLowerCase() === 'hang up') {
			if (this.ownerOrigin && channel.id === this.origin.id && !this.client.isOwner(msg.author)) {
				return this.recipient.send('☎️ You cannot hang up in an admin call.');
			}
			return this.hangup(channel);
		}
		if (this.cooldown.has(msg.author.id) && !this.client.isOwner(msg.author)) {
			const badChannel = channel.id === this.origin.id ? this.recipient : this.origin;
			return badChannel.send(`☎️ ${msg.author}, slow down! You're sending messages too fast!`);
		}
		this.setTimeout();
		if (!this.client.isOwner(msg.author)) {
			const ratelimit = this.ratelimitMeters.get(msg.author.id);
			if (!ratelimit) this.ratelimitMeters.set(msg.author.id, 0);
			if (ratelimit > 1) {
				this.cooldown.add(msg.author.id);
				setTimeout(() => {
					this.cooldown.delete(msg.author.id);
					this.ratelimitMeters.set(msg.author.id, 0);
				}, 10000);
			} else {
				this.ratelimitMeters.set(msg.author.id, this.ratelimitMeters.get(msg.author.id) + 1);
				setTimeout(() => this.ratelimitMeters.set(msg.author.id, 0), 5000);
			}
		}
		const attachments = hasImage ? msg.attachments.map(a => a.url).join('\n') : null;
		if (!hasText && hasImage) return channel.send(`☎️ **${msg.author.tag}:**\n${attachments}`);
		if (!hasText && hasEmbed) return channel.send(`☎️ **${msg.author.tag}** sent an embed.`);
		let content = stripInvites(msg.content);
		content = content.length > 1000 ? `${shorten(content, 500)} (Message too long)` : content;
		return channel.send(`☎️ **${msg.author.tag}:** ${content}\n${attachments || ''}`.trim());
	}

	sendVoicemail(channel, msg) {
		return channel.send(stripIndents`
			☎️ New Voicemail from **${msg.guild.name}:**
			**${msg.author.tag}:** ${stripInvites(msg.content)}
		`);
	}

	setTimeout() {
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.hangup('time'), 60000);
		return this.timeout;
	}
};
