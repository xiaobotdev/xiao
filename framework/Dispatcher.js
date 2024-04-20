const minimist = require('minimist');
const { stripIndents } = require('common-tags');
const argRegex = /"([^"]*)"|(\S+)/g;

module.exports = class CommandDispatcher {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this._commandPattern = null;
	}

	get commandPattern() {
		if (this._commandPattern) return this._commandPattern;
		const prefix = this.client.commandPrefix;
		const mention = `<@!?${this.client.user.id}>\\s+(?:${prefix}}\\s*)?|`;
		this._commandPattern = new RegExp(
			`^(${this.client.mentionPrefix ? mention : ''}${prefix}\\s*)([^\\s]+)`, 'i'
		);
		return this._commandPattern;
	}

	isCommand(msg) {
		const command = msg.content.match(this.commandPattern);
		return Boolean(command);
	}

	isPatternCommand(msg) {
		const patternCommands = this.client.registry.commands
			.filter(cmd => cmd.patterns.length && cmd.patterns.some(pattern => pattern.test(msg.content)));
		if (!patternCommands.size) return false;
		return patternCommands.first();
	}

	async parseMessage(msg) {
		const matched = msg.content.match(this.commandPattern);
		const command = this.resolveCommand(matched[2].toLowerCase());
		if (!command) {
			return {
				command: this.client.registry.commands.find(cmd => cmd.unknown),
				args: { command: matched[2].toLowerCase() }
			};
		}
		const content = msg.content.replace(this.commandPattern, '').trim();
		const result = (content.match(argRegex) || []).map(m => m.replace(argRegex, '$1$2'));
		const parsed = minimist(result, { boolean: true });
		const finalResult = { flags: parsed };
		for (let i = 0; i < command.args.length; i++) {
			const arg = command.args[i];
			if (arg.infinite) {
				const infinite = parsed._.slice(i);
				if (!infinite.length) {
					if (arg.isEmpty(infinite.join(' '), msg, arg)) {
						if (arg.default) {
							finalResult[arg.key] = typeof arg.default === 'function' ? arg.default(msg) : arg.default;
							break;
						} else {
							return {
								command,
								error: stripIndents`
									The "${arg.label || arg.key}" argument is required.
									${arg.invalidText}
								`
							};
						}
					}
				}
				const parsedArgs = [];
				for (const parsedArg of infinite) {
					const valid = await arg.validate(parsedArg, msg, arg);
					if (typeof valid === 'string') {
						return { command, error: valid };
					} else if (!valid) {
						return {
							command,
							error: stripIndents`
								An invalid value was provided for one of the "${arg.label || arg.key}" arguments.
								${arg.invalidText}
							`
						};
					}
					parsedArgs.push(await arg.parse(parsedArg, msg, arg));
				}
				finalResult[arg.key] = parsedArgs;
				break;
			}
			const parsedArg = i + 1 === command.args.length ? parsed._.slice(i).join(' ') : parsed._[i]?.toString();
			if (arg.isEmpty(parsedArg, msg, arg)) {
				if (arg.default === null) {
					return {
						command,
						error: stripIndents`
							The "${arg.label || arg.key}" argument is required.
							${arg.invalidText}
						`
					};
				} else {
					finalResult[arg.key] = typeof arg.default === 'function' ? arg.default(msg) : arg.default;
					continue;
				}
			}
			const valid = await arg.validate(parsedArg, msg, arg);
			if (typeof valid === 'string') {
				return { command, error: valid };
			} else if (!valid) {
				return {
					command,
					error: stripIndents`
						An invalid value was provided for the "${arg.label || arg.key}" argument.
						${arg.invalidText}
					`
				};
			}
			finalResult[arg.key] = await arg.parse(parsedArg, msg, arg);
		}
		return { command, args: finalResult };
	}

	resolveCommand(command) {
		return this.client.registry.commands.find(cmd => cmd.name === command || cmd.aliases.includes(command));
	}
};
