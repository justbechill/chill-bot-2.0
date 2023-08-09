const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jinx')
        .setDescription('Sends a random picture of the second best cat Jinx!'),
    async execute(client, interaction) {
        const files = fs.readdirSync('./images/jinx')
        const index = Math.floor(Math.random() * files.length)

        interaction.reply({ files: [`./images/jinx/${files[index]}`] })
    }
}