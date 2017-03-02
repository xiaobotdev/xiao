const commando = require('discord.js-commando');

class RoastMeCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'roast', 
            group: 'response',
            memberName: 'roast',
            description: 'Roasts the user of your choice. (;roast @User)',
            examples: [';roast @username']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        let coin = ["*puts you in the oven*", "You're so stupid.", "Sorry, I can't hear you over how annoying you are.", "I've got better things to do.", "You're as dumb as Cleverbot.", "Your IQ is lower than the Mariana Trench.", "You're so annoying even the flies stay away from your stench.", "Go away, please.", "I'd give you a nasty look but you've already got one.", "It looks like your face caught fire and someone tried to put it out with a hammer.", "Your family tree must be a cactus because everyone on it is a prick.", "Someday you will go far, and I hope you stay there.", "The zoo called. They're wondering how you got out of your cage.", "I was hoping for a battle of wits, but you appear to be unarmed.", "You are proof that evolution can go in reverse.", "Brains aren't everything, in your case, they're nothing.", "Sorry I didn't get that, I don't speak idiot.", "Why is it acceptable for you to be an idiot, but not for me to point it out?", "We all sprang from apes, but you did not spring far enough.", "You're an unknown command.", "If you could go anywhere I chose, I'd choose dead.", "Even monkeys can go to space, so clearly you lack some potential.", "It's brains over brawn, yet you have neither.", "You look like a monkey, and you smell like one too.", "Even among idiots you're lacking.", "You fail even when you're doing absolutely nothing.", "If there was a vote for 'least likely to succeed' you'd win first prize.", "I'm surrounded by idiots... Or, wait, that's just you.", "I wanna go home. Well, really I just want to get away from the awful aroma you've got going there.", "Every time you touch me I have to go home and wash all my clothes nine times just to get a normal smell back.", "If I had a nickel for every brain you don't have, I'd have one dollar.", "I'd help you succeed but you're incapable."][Math.floor(Math.random() * 32)];
        if(username === '') {
            message.reply(coin);
        } else {
            message.channel.sendMessage(username + ", " + coin);
        }
    }
}

module.exports = RoastMeCommand;