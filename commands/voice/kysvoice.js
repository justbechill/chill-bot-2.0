const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: {
        name: 'kys voice',
        description: 'Yo... I usually respect you here.',
        terms: [' kys ', 'kill yourself', 'keep yourself safe', ' ays ', 'eat yourself safe']
    },

    async execute(client, message) {
        const player = createAudioPlayer();
        const resource = createAudioResource('audio/kys.mp3')

        
        player.play(resource)
        client.connections[message.guild.id].subscribe(player);
    }
    
}