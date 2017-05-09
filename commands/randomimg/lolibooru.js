const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class LolibooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lolibooru',
            group: 'randomimg',
            memberName: 'lolibooru',
            description: 'Sends a random (Possibly NSFW!) anime image from Lolibooru.',
            guildOnly: true
        });
    }

    async run(msg) {
        if (!msg.channel.nsfw) return msg.say('This Command can only be used in NSFW Channels.');
        if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
            return msg.say('This Command requires the `Attach Files` Permission.');
        try {
            const { body } = await request
                .get('https://lolibooru.moe/post/index.json?tags=order:random&limit=1');
            return msg.channel.send({ files: [body[0].file_url] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
