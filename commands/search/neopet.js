const commando = require('discord.js-commando');

class NeopetCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'neopet', 
            group: 'search',
            memberName: 'neopet',
            description: "Gives a Neopet's image, searchable by ID. (;neopet rjwlsb8k) (;neopet getID for help on getting your Pet's ID)",
            examples: [';neopet rjwlsb8k']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let [petID] = message.content.split(" ").slice(1);
        if(petID === "getID") {
	        message.channel.sendMessage("To get your pet's ID, simply go to http://www.sunnyneo.com/petimagefinder.php and enter your pet's name. It's image should show up. Then, find the link below the pet's image, and copy it to your message!").then(message.channel.sendFile('./images/PetID.png').then(message.channel.sendMessage("It's recommended you keep this ID with you so you can easily share your pet's picture without having to repeat these steps.")));
        } else {
	        message.channel.sendMessage("Result for: " + petID).then(message.channel.sendFile('http://pets.neopets.com/cp/' + petID + '/1/5.png').catch(error => message.channel.sendMessage(":x: Error! Pet ID Not Found!")));
        }
    }
}

module.exports = NeopetCommand;