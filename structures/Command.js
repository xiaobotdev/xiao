const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
    constructor(client, info) {
        super(client, info);

        this.ownerOnly = info.ownerOnly;
        this.nsfw = info.nsfw;
        this.clientPermissions = info.clientPermissions;
        this.userPermissions = info.userPermissions;
    }

    hasPermission(msg) {
        if (this.ownerOnly && !this.client.isOwner(msg.author)) {
            return 'This Command can only be used by the bot owner.';
        }
        if (this.nsfw && !msg.channel.nsfw) {
            return 'This Command can only be used in NSFW Channels.';
        }
        if (msg.channel.type !== 'dm') {
            if (this.clientPermissions) {
                for (const permission of this.clientPermissions) {
                    if (!msg.channel.permissionsFor(this.client.user).has(permission)) {
                        return `This Command requires the \`${permission}\` Permission.`;
                    }
                }
            }
            if (this.userPermissions) {
                for (const permission of this.userPermissions) {
                    if (!msg.channel.permissionsFor(msg.author).has(permission)) {
                        return `You do not have the \`${permission}\` Permission.`;
                    }
                }
            }
        }
        return true;
    }
}

module.exports = XiaoCommand;
