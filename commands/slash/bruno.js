const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bruno')
        .setDescription('Sends a random picture of the absolute best cat, Bruno!'),
    async execute(client, interaction) {
        const files = fs.readdirSync('./images/bruno')
        const index = Math.floor(Math.random() * files.length)

        interaction.reply({ files: [`./images/bruno/${files[index]}`] })
    }
}