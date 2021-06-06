const minimist = require('minimist');
const argRegex = /"([^"]*)"|(\b[^]+)/g;

module.exports = class CommandDispatcher {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this._commandPattern = null;
	}

	get commandPattern() {
		if (this._commandPattern) return this._commandPattern;
		const prefix = this.client.commandPrefix;
		this._commandPattern = new RegExp(
			`^(<@!?${this.client.user.id}>\\s+(?:${prefix}}\\s*)?|${prefix}\\s*)([^\\s]+)`, 'i'
		);
		return this._commandPattern;
	}

	isCommand(msg) {
		const command = msg.content.match(this.commandPattern);
		return Boolean(command);
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
		const parsed = minimist(result);
		const finalResult = { flags: parsed };
		for (let i = 0; i < command.args.length; i++) {
			const arg = command.args[i];
			if (arg.infinite) {
				const infinite = parsed._.slice(i).map(j => j.toString());
				const parsedArgs = [];
				for (const parsedArg of infinite) {
					if (arg.isEmpty(parsedArg, msg, arg)) {
						if (arg.default) {
							finalResult[arg.key] = typeof arg.default === 'function' ? arg.default(msg) : arg.default;
							break;
						} else {
							return `The "${arg.label || arg.key}" argument is required.`;
						}
					}
					const valid = await arg.validate(parsedArg, msg, arg);
					if (!valid) return `An invalid value was provided for one of the "${arg.label || arg.key}" arguments.`;
					parsedArgs.push(await arg.parse(parsedArg, msg, arg));
				}
				finalResult[arg.key] = parsedArgs;
				break;
			}
			const parsedArg = parsed._[i]?.toString();
			if (arg.isEmpty(parsedArg, msg, arg)) {
				if (arg.default === null) {
					return `The "${arg.label || arg.key}" argument is required.`;
				} else {
					finalResult[arg.key] = typeof arg.default === 'function' ? arg.default(msg) : arg.default;
					continue;
				}
			}
			const valid = await arg.validate(parsedArg, msg, arg);
			if (!valid) return `An invalid value was provided for the "${arg.label || arg.key}" argument.`;
			finalResult[arg.key] = await arg.parse(parsedArg, msg, arg);
		}
		return { command, args: finalResult };
	}

	resolveCommand(command) {
		return this.client.registry.commands.find(cmd => cmd.name === command || cmd.aliases.includes(command));
	}
};
