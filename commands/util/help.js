const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['commands'],
            group: 'util',
            memberName: 'help',
            description: 'Displays a list of available commands, or detailed information for a specified command.',
            guarded: true,
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'command',
                    prompt: 'Which command would you like to view the help for?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const { command } = args;
        const commands = this.client.registry.findCommands(command, false, msg);
        const showAll = command && command.toLowerCase() === 'all';
        if (command && !showAll) {
            if (commands.length === 1) {
                return msg.say(stripIndents`
                    __Command **${commands[0].name}**:__ *${commands[0].description}*
                    ${commands[0].guildOnly ? 'Usable Only in Servers' : 'Usable in Servers and DM'}
                    **Format:** ${msg.anyUsage(`${commands[0].name} ${commands[0].format ? commands[0].format : ''}`)}
                    **Aliases:** ${commands[0].aliases.join(', ') || 'None'}
                    **Group:** ${commands[0].group.name}
                    ${commands[0].details || ''}
                `);
            } else {
                return msg.say(`Could not identify command. Use \`${msg.usage(null)}\` to view a list of commands.`);
            }
        } else {
            const embed = new RichEmbed()
                .setTitle(!showAll ? `Commands Available in ${msg.guild ? msg.guild.name : 'this DM'}` : 'All Commands')
                .setDescription(`Use \`${msg.usage('<command>')}\` to view detailed information about a command.`)
                .setColor(0x00AE86);
            for (const group of this.client.registry.groups.values()) {
                embed.addField(`❯ ${group.name}`,
                    showAll ?
                        group.commands.map((c) => c.name).join(', ') :
                        group.commands.filter((c) => c.isUsable(msg)).map((c) => c.name).join(', ') || 'None');
            }
            try {
                await msg.direct({ embed });
                return msg.say(':mailbox_with_mail: Sent you a DM with information.');
            } catch (err) {
                return msg.say('Failed to send DM. You probably have DMs disabled.');
            }
        }
    }
};
