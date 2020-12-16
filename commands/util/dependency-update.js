const Command = require('../../structures/Command');
const request = require('node-superfetch');
const semver = require('semver');
const { stripIndents } = require('common-tags');
const { dependencies, devDependencies } = require('../../package');

module.exports = class DependencyUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dependency-update',
			aliases: ['dep-update', 'dependencies-update', 'npm-update'],
			group: 'util',
			memberName: 'dependency-update',
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
		const needUpdate = [];
		for (const [dep, ver] of Object.entries(dependencies)) {
			const latest = await this.fetchVersion(dep);
			const clean = ver.replace(/^(\^|<=?|>=?|=|~)/, '');
			if (latest === clean) continue;
			needUpdate.push({
				name: dep,
				oldVer: clean,
				newVer: latest,
				breaking: !semver.satisfies(ver, latest)
			});
		}
		for (const [dep, ver] of Object.entries(devDependencies)) {
			const latest = await this.fetchVersion(dep);
			const clean = ver.replace(/^(\^|<=?|>=?|=|~)/, '');
			if (latest === clean) continue;
			needUpdate.push({
				name: dep,
				oldVer: clean,
				newVer: latest,
				breaking: !semver.satisfies(ver, latest)
			});
		}
		if (!needUpdate.length) return msg.say('All packages are up to date.');
		const updatesList = needUpdate.map(pkg => {
			const breaking = pkg.breaking ? ' ⚠️' : '';
			return `${pkg.name} (${pkg.oldVer} -> ${pkg.newVer})${breaking}`;
		});
		return msg.say(stripIndents`
			__**Package Updates Available:**__
			${updatesList.join('\n')}
		`);
	}

	async fetchVersion(dependency) {
		const { body } = await request.get(`https://registry.npmjs.com/${dependency}`);
		if (body.time.unpublished) return null;
		return body['dist-tags'].latest;
	}
};
