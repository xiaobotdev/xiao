const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
    constructor(client, info) {
        super(client, info);

        this.ownerOnly = info.ownerOnly;
        this.nsfw = info.nsfw;
        this.clientPermissions = info.clientPermissions;
        this.allowStaff = info.allowStaff;
        this.userPermissions = info.userPermissions;
    }

    hasPermission(msg) {
        if (this.ownerOnly) {
            if (!this.client.isOwner(msg.author)) return 'This Command can only be used by the bot owner.';
        }
        if (this.nsfw) {
            if (!msg.channel.nsfw) return 'This Command can only be used in NSFW Channels.';
        }
        if (msg.channel.type !== 'dm') {
            if (this.clientPermissions) {
                for (const permission of this.clientPermissions) {
                    if (!msg.channel.permissionsFor(this.client.user).has(permission))
                        return `This Command requires the \`${permission}\` Permission.`;
                }
            }
            const staffRole = msg.guild.settings.get('staffRole');
            if (staffRole && this.allowStaff) {
                if (!msg.member.roles.has(staffRole))
                    return `This Command can only be used by the \`${msg.guild.roles.get(staffRole).name}\` role.`;
            }
            if (this.userPermissions && (this.allowStaff ? !msg.member.roles.has(staffRole) : true)) {
                for (const permission of this.userPermissions) {
                    if (!msg.channel.permissionsFor(msg.author).has(permission))
                        return `You do not have the \`${permission}\` Permission.`;
                }
            }
        }
        return true;
    }
}

module.exports = XiaoCommand;
