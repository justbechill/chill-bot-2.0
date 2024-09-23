const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const database = require('../../database');

module.exports = {
    data: {
        name: 'counting',
        description: 'Counting can be enabled by using `/setchannel`.',
        terms: []
    },

    async execute(client, message) {

        const config = await database.getServer(message.guild.id);

        if(!config || !config.countingChannel) return;

        const channel = message.guild.channels.cache.get(config.countingChannel);

        if(!channel || channel.id != message.channel.id) return;
        if(!config.currentNumber) config.currentNumber = 0;

        if(!isNaN(parseInt(message.content))) {
            if(parseInt(message.content) == config.currentNumber + 1) {
                if(config.lastCounter == message.author.id) {
                    await message.channel.send(`You can't count twice in a row idiot.`);
                } else {
                    config.currentNumber++;

                    message.react('✅');
                }
            } else {

                if(config.lastCounter == message.author.id) {
                    await message.channel.send(`You can't count twice in a row idiot.`);
                } else {
                    config.currentNumber = 0;
    
                    message.react('❌');
    
                    for(let i = 0; i < 5; i++) {
                        await channel.send(`${message.author} bitch`);
                    }
                }
            }
            console.log(config.currentNumber)
            config.lastCounter = message.author.id;
            database.setServer(config);
        }


    }
}