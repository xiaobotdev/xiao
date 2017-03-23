const commando = require('discord.js-commando');

module.exports = class FistBumpCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'fistbump',
            group: 'roleplay',
            memberName: 'fistbump',
            description: 'Fistbumps someone. (;fistbump @User)',
            examples: [';fistbump @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *fistbumps* ' + thingToRoleplay + ' *badalalala*');
    }
};
