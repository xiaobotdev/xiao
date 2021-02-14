const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');
const { shorten, stripInvites, preventURLEmbeds, verify } = require('../../util/Util');

module.exports = class PhoneCall {
	constructor(client, startUser, origin, recipient, adminCall) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = `${origin.guild ? origin.id : startUser.id}:${recipient.id}`;
		this.origin = origin;
		this.originDM = !origin.guild;
		this.recipient = recipient;
		this.startUser = startUser;
		this.active = false;
		this.timeout = null;
		this.adminCall = adminCall || false;
		this.cooldown = new Set();
		this.ratelimitMeters = new Map();
		this.timeStarted = null;
	}

	async start() {
		if (this.adminCall) {
			await this.origin.send(`☎️ Admin call started with **${this.recipient.guild.name}**.`);
			if (this.originDM) {
				await this.recipient.send(`☎️ An **ADMIN** call from **${this.startUser.tag}'s DMs** has begun.`);
			} else {
				await this.recipient.send(`☎️ An **ADMIN** call from **${this.origin.guild.name}** has begun.`);
			}
		} else {
			await this.origin.send(`☎️ Calling **${this.recipient.guild.name} (${this.recipient.id})**...`);
			if (this.originDM) {
				await this.recipient.send(
					`☎️ Incoming call from **${this.startUser.tag}'s DM (${this.startUser.id})**. Pick up?`
				);
			} else {
				await this.recipient.send(`☎️ Incoming call from **${this.origin.guild.name} (${this.origin.id})**. Pick up?`);
			}
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
		this.timeStarted = new Date();
		this.setTimeout();
		if (this.adminCall) return this;
		const usage = this.client.registry.commands.get('hang-up').usage();
		if (!this.origin.topic.includes('<xiao:phone:no-notice>')) await this.sendNotice(this.origin);
		await this.origin.send(`☎️ **${this.recipient.guild.name}** picked up! Use ${usage} to hang up.`);
		if (this.originDM) {
			await this.sendNotice(this.recipient, true);
			await this.recipient.send(`☎️ Accepted call from **${this.startUser.tag}'s DM**. Use ${usage} to hang up.`);
		} else {
			if (!this.recipient.topic.includes('<xiao:phone:no-notice>')) await this.sendNotice(this.recipient);
			await this.recipient.send(`☎️ Accepted call from **${this.origin.guild.name}**. Use ${usage} to hang up.`);
		}
		return this;
	}

	async hangup(nonQuitter, validation) {
		this.active = false;
		clearTimeout(this.timeout);
		if (nonQuitter === 'time') {
			await this.origin.send(`☎️ Call ended due to inactivity. _(Lasted ${this.durationDisplay})_`);
			await this.recipient.send(`☎️ Call ended due to inactivity. _(Lasted ${this.durationDisplay})_`);
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
			if (quitter.guild) {
				await nonQuitter.send(`☎️ **${quitter.guild.name}** hung up. _(Lasted ${this.durationDisplay})_`);
			} else {
				await nonQuitter.send(`☎️ **${this.startUser.tag}** hung up. _(Lasted ${this.durationDisplay})_`);
			}
			await quitter.send(`☎️ Hung up. _(Lasted ${this.durationDisplay})_`);
		}
		this.client.phone.delete(this.id);
		return this;
	}

	send(channel, msg, hasText, hasImage, hasEmbed) {
		const otherChannel = channel.id === this.origin.id ? this.recipient : this.origin;
		if (this.cooldown.has(msg.author.id) && !this.client.isOwner(msg.author)) {
			return otherChannel.send(`☎️ ${msg.author}, slow down! You're sending messages too fast!`);
		}
		if (this.client.phone.isBlocked(otherChannel, channel, msg.author)) {
			return otherChannel.send(`☎️ ${msg.author}, you are blocked from sending messages to this channel!`);
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
		const attachments = hasImage ? msg.attachments.map(a => this.cleanContent(a.url)).join('\n') : null;
		if (!hasText && hasImage) return channel.send(`☎️ **${msg.author.tag}:**\n${attachments}`);
		if (!hasText && hasEmbed) return channel.send(`☎️ **${msg.author.tag}** sent an embed.`);
		const content = msg.content.length > 1000 ? `${shorten(msg.content, 500)} (Message too long)` : msg.content;
		return channel.send(`☎️ **${msg.author.tag}:** ${this.cleanContent(content)}\n${attachments || ''}`.trim());
	}

	sendVoicemail(channel, msg) {
		return channel.send(stripIndents`
			☎️ New Voicemail from **${this.originDM ? `${this.startUser.tag}'s DMs` : this.origin.guild.name}:**
			**${msg.author.tag}:** ${this.cleanContent(msg.content)}
		`);
	}

	setTimeout() {
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.hangup('time'), 60000);
		return this.timeout;
	}

	get durationDisplay() {
		return moment.duration(Date.now() - this.timeStarted).format('hh[h]mm[m]ss[s]');
	}

	cleanContent(str) {
		str = stripInvites(str);
		str = preventURLEmbeds(str);
		return str;
	}

	sendNotice(channel, dm) {
		const reportUsage = this.client.registry.commands.get('report').usage('abuse <reason>');
		return channel.send(stripIndents`
			⚠️ **Notice:** ⚠️
			Sending illegal, NSFW, obscene, or hateful content can result in you and your server being banned from Xiao.
			To report abuse, use ${reportUsage} (please include IDs and user tags).
			${dm ? '' : 'To hide this notice, place `<xiao:phone:no-notice>` in your channel topic.'}
		`);
	}
};
