const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: {
        name: 'kys chat',
        description: 'Yo... I usually respect you here.',
        terms: ['kys', 'kill yourself', 'keep yourself safe']
    },

    async execute(client, message) {
        message.channel.send("Yo... I usually respect you here. But this is not okay. I don't know the context of what is happening, or if this was called for in any context, but it's never okay.\n\nYou never know what someone is struggling through. That could be someone's last straw. I also don't know who you were saying it to, but not okay.\n\nHonestly, next time think before you type. I don't know what's happening in this channel, but it looks like it's going places, and I don't want to stay here for any longer.\n\nSo next time, think. They could be struggling and tomorrow might not come for them because of that. Know who you can say it to and who you can't\n\nI felt the need to write a paragraph today... so you got one. Thanks, be better. :)\n\n(Apparently this goes to @Nuggets too)")
    }
}