const commando = require('discord.js-commando');

class RandomPun extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'pun', 
            group: 'response',
            memberName: 'pun',
            description: 'Sends a random pun image. (;pun)',
            examples: [';pun']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        let pun = ["Pun1.jpg", "Pun2.jpg", "Pun3.jpg", "Pun4.jpg", "Pun5.jpg", "Pun6.jpg", "Pun7.jpg", "Pun8.png", "Pun9.jpg", "Pun10.jpg", "Pun11.jpg", "Pun12.jpg", "Pun13.jpg", "Pun14.jpg", "Pun15.jpg", "Pun16.jpg", "Pun17.jpg", "Pun18.jpg", "Pun19.jpg", "Pun20.jpg", "Pun21.jpg", "Pun22.jpg", "Pun23.jpg", "Pun24.jpg", "Pun25.jpg", "Pun26.jpg", "Pun27.jpg", "Pun28.jpg", "Pun29.jpg", "Pun30.jpeg", "Pun31.jpg", "Pun32.jpg", "Pun33.jpg", "Pun34.png", "Pun35.jpg", "Pun36.jpg", "Pun37.jpg", "Pun38.jpg", "Pun39.jpg", "Pun40.jpg", "Pun41.jpg", "Pun42.jpg", "Pun43.jpg", "Pun44.jpg", "Pun45.gif", "Pun46.jpg", "Pun47.jpg", "Pun48.jpg", "Pun49.jpg", "Pun50.jpg", "Pun51.jpg", "Pun52.jpg", "Pun53.jpg"][Math.floor(Math.random() * 53)];
        message.channel.sendFile("./images/" + pun);
    }
}

module.exports = RandomPun;