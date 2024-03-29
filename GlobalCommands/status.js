const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { connection } = require('mongoose')

module.exports = {
    name: 'status',
    description: 'Displays status of the bot',
    async execute(client, interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const ping = (interaction.createdTimestamp - Date.now()) * (-1)
            const messsage = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`**CLIENT**: \`🟢 ONLINE\`\n**PING**: \`${ping}\`\n**UPTIME**: <t:${Math.floor(parseInt(client.readyAt / 1000))}:R>\n\n**DATABASE**: \`${switchTo(connection.readyState)}\``)
            return await interaction.reply({ embeds: [messsage] })
        }
        await interaction.reply({ content: '**❌ You are not authorized to use this**', ephemeral: true })
    }
}

function switchTo(val) {
    let status = ' ';
    switch (val) {
        case 0:
            status = '🔴 DISCONNECTED'
            break;
        case 1:
            status = '🟢 CONNECTED'
            break;
        case 2:
            status = '🟠 CONNECTING'
            break;
    }
    return status
}