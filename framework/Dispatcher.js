const minimist = require('minimist');
const argRegex = /"([^"]*)"|(\S+)/g;

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
				command: this.registry.commands.find(cmd => cmd.unknown),
				args: { command: command[2].toLowerCase() }
			};
		}
		const content = msg.content.replace(this.commandPattern, '').trim();
		const firstResult = (content.match(argRegex) || []).map(m => m.replace(argRegex, '$1$2'));
		const parsed = minimist(firstResult);
		const result = { flags: [...parsed] };
		for (let i = 0; i < command.args.length; i++) {
			const arg = command.args[i];
			const parsedArg = result._[i];
			if (arg.isEmpty(parsedArg, msg, arg)) {
				if (arg.default) {
					result[arg.name] = typeof arg.default === 'function' ? arg.default(msg) : arg.default;
					continue;
				} else {
					return `The "${arg.label || arg.name}" argument is required.`;
				}
			}
			const valid = await arg.validate(parsedArg, msg, arg);
			if (!valid) return `An invalid value was provided for the "${arg.label || arg.name}" argument.`;
			result[arg.name] = await arg.parse(parsedArg, msg, arg);
		}
		return { command, args: result };
	}

	resolveCommand(command) {
		return this.registry.commands.find(cmd => cmd.name === command || cmd.aliases.includes(command));
	}
};
