const Command = require('../../framework/Command');
const request = require('node-superfetch');
const semver = require('semver');
const { reactIfAble } = require('../../util/Util');
const { dependencies, devDependencies, optionalDependencies } = require('../../package');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;

module.exports = class DependencyUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dependency-update',
			aliases: ['dep-update', 'dependencies-update', 'npm-update', 'deps', 'update-deps'],
			group: 'util',
			description: 'Checks for dependency updates.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			credit: [
				{
					name: 'npm',
					url: 'https://www.npmjs.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		await reactIfAble(msg, msg.author, LOADING_EMOJI_ID, '💬');
		const needUpdate = [];
		const optionalNeedsUpdate = [];
		for (const [dep, ver] of Object.entries(dependencies)) {
			const update = await this.parseUpdate(dep, ver);
			if (!update) continue;
			needUpdate.push(update);
		}
		for (const [dep, ver] of Object.entries(devDependencies)) {
			const update = await this.parseUpdate(dep, ver);
			if (!update) continue;
			optionalNeedsUpdate.push(update);
		}
		for (const [dep, ver] of Object.entries(optionalDependencies)) {
			const update = await this.parseUpdate(dep, ver);
			if (!update) continue;
			optionalNeedsUpdate.push(update);
		}
		if (!needUpdate.length && !optionalNeedsUpdate.length) return msg.say('👍 All packages are up to date.');
		const updatesList = needUpdate.map(pkg => {
			const breaking = pkg.breaking ? ' ⚠️' : '';
			return `${pkg.name} (${pkg.oldVer} -> ${pkg.newVer})${breaking}`;
		});
		const optionalList = optionalNeedsUpdate.map(pkg => {
			const breaking = pkg.breaking ? ' ⚠️' : '';
			return `${pkg.name} (${pkg.oldVer} -> ${pkg.newVer})${breaking}`;
		});
		await reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		let result = '';
		if (needUpdate.length) {
			result += `__**Package Updates Available:**__\n${updatesList.join('\n')}`;
		}
		if (optionalNeedsUpdate.length) {
			result += `\n\n__**Optional/Dev Updates Available:**__\n${optionalList.join('\n')}`;
		}
		return msg.say(result.trim());
	}

	async fetchVersion(dependency) {
		const { body } = await request.get(`https://registry.npmjs.com/${dependency}`);
		if (body.time.unpublished) return null;
		return body['dist-tags'].latest;
	}

	async parseUpdate(dep, ver) {
		if (ver.startsWith('github:')) return null;
		const latest = await this.fetchVersion(dep);
		const clean = ver.replace(/^(\^|<=?|>=?|=|~)/, '');
		if (latest === clean) return null;
		return {
			name: dep,
			oldVer: clean,
			newVer: latest,
			breaking: !semver.satisfies(latest, ver)
		};
	}
};
