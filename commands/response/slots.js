const commando = require('discord.js-commando');

class SlotsCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'slots', 
            group: 'response',
            memberName: 'slots',
            description: 'Play slots. (;slots)',
            examples: [';slots']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
        let slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
        let slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
        let slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
        let slotFour = slotThing[Math.floor(Math.random() * slotThing.length)];
        if(slotOne === slotTwo && slotOne === slotThree && slotOne === slotFour) {
        	message.channel.sendMessage(slotOne + '|' + slotTwo + '|' + slotThree + '|' + slotFour + "\nWow! You won! Great job... er... luck!");
        } else {
        	message.channel.sendMessage(slotOne + '|' + slotTwo + '|' + slotThree + '|' + slotFour + "\nAww... You lost... Guess it's just bad luck, huh?");
        }
    }
}

module.exports = SlotsCommand;