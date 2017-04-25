const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: [
                'unbanne'
            ],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user and logs the unban to the mod_logs.',
            guildOnly: true,
            args: [{
                key: 'memberID',
                prompt: 'What member do you want to unban? Please enter the ID of the user.',
                type: 'string',
                validate: userID => {
                    if (userID.length === 18)
                        return true;
                    return `${userID} is not a valid ID. Please enter the user you wish to unban's ID.`;
                }
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 140)
                        return true;
                    return `Please keep your reason under 140 characters, you have ${reason.length}.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('BAN_MEMBERS');
    }

    async run(message, args) {
        if (!message.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS'))
            return message.say(':x: Error! I don\'t have the Ban Members Permission!');
        const modlogs = message.guild.channels.find('name', 'mod_logs');
        if (!modlogs)
            return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        if (!modlogs.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
            return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        const { memberID, reason } = args;
        const bans = await message.guild.fetchBans();
        if (!bans.has(memberID))
            return message.say(':x: Error! Could not find this user in the bans.');
        const unbanUser = await bans.get(memberID);
        try {
            await message.guild.unban(unbanUser);
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(`**Member:** ${unbanUser.tag} (${unbanUser.id})\n**Action:** Unban\n**Reason:** ${reason}`);
            return modlogs.send({embed});
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
