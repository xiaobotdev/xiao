const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class DogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dog',
            group: 'randomimg',
            memberName: 'dog',
            description: 'Sends a random dog image.'
        });
    }

    async run(msg) {
        if(msg.channel.type !== 'dm')
            if(!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        try {
            const { body } = await request
                .get('https://random.dog/woof.json');
            return msg.channel.send({ files: [body.url] })
                .catch(err => msg.say(`An Error Occurred: ${err}`));
        } catch(err) {
            return msg.say('An Unknown Error Occurred.');
        }
    }
};
