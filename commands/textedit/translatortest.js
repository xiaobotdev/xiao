const commando = require('discord.js-commando');
const translator = require('../../src/translatetest.js');

module.exports = class TranslatorCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'translatetest',
            group: 'util',
            memberName: 'translatetest',
            description: "A test for a custom translator.",
            examples: [";servers"]
        });
    }
	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
	    let thingToTranslate = message.content.split(" ").slice(1).join(" ");
	    let translated = translator.translate(thingToTranslate);
	    message.channel.send(translated);
    }
};