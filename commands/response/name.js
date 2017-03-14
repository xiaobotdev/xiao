const commando = require('discord.js-commando');

class RandomNameGen extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'name', 
            group: 'response',
            memberName: 'name',
            description: 'Generates a random name (;name Male or ;name Female)',
            examples: [';name', ';name male', ';name female']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let randomfirstmale = ["Bob", "Daniel", "Logan", "Chris", "Nathan", "George", "Mart", "Charlie", "Felix", "Ralph", "William", "Max", "Jerry", "Marty", "Joshua", "Cody", "Richard", "Alex", "Alexander", "Jordan", "Zachary", "Bill", "Alfred", "Bruce", "Caiden", "Calvin", "Eric", "Robert", "Mark", "Miles", "Nash", "Ronald", "Ivan", "Edgar", "Royal", "Augustine", "Dominic", "Noel", "Rocky", "Grover", "Paul", "Jeremy", "Stevie", "Brock", "Jc", "Tony", "Enoch", "Zachery", "Harvey", "Gilbert", "Chang", "Emery", "Carroll", "Odell", "Jean", "Archie", "Russ", "Barry", "Lowell", "Jacob", "Riku", "Frederic", "Levi", "Faustino", "Leland", "Domenic", "Irwin", "Moises", "Louie", "Larry", "Victor"];
        randomfirstmale = randomfirstmale[Math.floor(Math.random() * randomfirstmale.length)];
        let randomfirstfemale = ["Elizabeth", "Chelsey", "Rachel", "Logan", "Alex", "Jordan", "Mary", "Shirley", "Sandy", "Linda", "Audrey", "Autumn", "Gracie", "Grace", "Erin", "Catherine", "Stephanie", "Lucy", "Patty", "Julie", "Christina", "Fiona", "Riley", "Ashley", "Bree", "Lucila", "Wendi", "Evangelina", "Ricki", "Merna", "Tegan", "Venus", "Claris", "Tana", "Sakura", "Edythe", "Adena", "Princess", "Elnora", "Star", "Edyth", "Beverly", "Kelsie", "Letha", "Latisha", "Lolita", "Bernandine", "Jessenia", "Hannah", "Leonore", "Alene", "Fannie", "Bernardine", "Leena", "Tera", "Yvette", "Melisa", "Alissa", "Xiao", "Richelle", "Bridgett", "Sumiko", "Paulette", "Charlott", "Honey", "Veola", "Sherita", "Amanda", "Vannessa", "April", "Ruth"];
        randomfirstfemale = randomfirstfemale[Math.floor(Math.random() * randomfirstfemale.length)];
        let randomlast = ["Walker", "Tworni", "Ross", "Smith", "Odendahl", "Deere", "Brown", "Williams", "Jones", "Miles", "Moss", "Roberto", "McFly", "McDonald", "Lewis", "Armstrong", "Stevenson", "Schwarzenegger", "Robinson", "Parker", "Piper", "Johnson", "Brantley", "Stewart", "Ree", "Talbot", "Seville", "Peace", "Spielberg", "Baggins", "Wilborn", "Vankirk", "Shireman", "Jimerson", "Masters", "Hack", "Satcher", "Younkin", "Aguila", "Duffey", "Burgin", "Highfall", "Wee", "Solari", "Tomaselli", "Basler", "Difranco", "Latch", "Rives", "Dolan", "Abraham", "Holter", "Portugal", "Lininger", "Holst", "Mccroy", "Follmer", "Hotchkiss", "Gassaway", "Wang", "Agron", "Raasch", "Gourd", "Czaja", "Marquart", "Papadopoulos", "Ringer", "Lax", "Sperling", "Galusha", "Alston"];
        randomlast = randomlast[Math.floor(Math.random() * randomlast.length)];
        let randomfirstboth = [randomfirstmale, randomfirstfemale]
        randomfirstboth = randomfirstboth[Math.floor(Math.random() * randomfirstboth.length)];
        if(message.content.toLowerCase().split(" ").slice(1).includes("male")) {
            message.channel.sendMessage(randomfirstmale + " " + randomlast);
        } else if(message.content.toLowerCase().split(" ").slice(1).includes("female")) {
            message.channel.sendMessage(randomfirstfemale + " " + randomlast);
        } else {
            message.channel.sendMessage(randomfirstboth + " " + randomlast);
        }
    }
}

module.exports = RandomNameGen;