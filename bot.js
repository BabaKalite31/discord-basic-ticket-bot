const { Client, MessageButton, MessageEmbed, Intents } = require('discord.js');

const token = 'MTExNjE0NDI0MDkzNDc4OTEzMw.GtAO9W.ZQCFguFCQB6ASPQKM6fMSOMq50JcMqDwtq5o8c'; //Token Buraya
const categoryId = '1105574705861230653'; //Ticket Kanaların Oluşucağı Katagori id
const allowedRoleId = '1104438082125701120'; //Ticket Ları Görebilicek Rol İd
const adminRoleId = '1107064783297064980'; //Sunucudaki Admin Rol İd

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });



client.on('ready', () => {
    console.log(` Bot Başaralıyla Giriş Yaptı`);
    client.user.setPresence({
        status: 'dnd', // Rahatsız Etmeyin 
        activities: [{ name: 'Ticketları', type: 'WATCHING' }], //Aktivite 
    });

});

//.ticket Komutu 

let ticketCount = 0;

client.on('messageCreate', async(message) => {
    if (message.content.toLowerCase() === '.ticket') {
        const button = new MessageButton()
            .setCustomId('create_ticket')
            .setLabel('Ticket Oluştur')
            .setStyle('PRIMARY');

        const embed = new MessageEmbed()
            .setColor('PRIMARY')
            .setTitle('Kedicik Ticket Sistemi')
            .setDescription('Ticket oluşturmak için aşağıdaki butona tıklayın:')
            .setFooter('Dev By function checkServerStatus#3027');
        embed.setThumbnail('https://cdn.discordapp.com/attachments/1104412013666500630/1116121831942918235/attachment_115998183.png');
        message.channel.send({
            embeds: [embed],
            components: [{ type: 'ACTION_ROW', components: [button] }],
        });
    }
})

client.on('interactionCreate', async(interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const member = interaction.member;
        if (!member) return;

        const guild = interaction.guild;
        if (!guild) return;

        const category = guild.channels.cache.get(categoryId);
        if (!category || category.type !== 'GUILD_CATEGORY') return;

        const allowedRole = guild.roles.cache.get(allowedRoleId);
        if (!allowedRole) return;

        const adminRole = guild.roles.cache.get(adminRoleId);
        if (!adminRole) return;

        ticketCount++;
        const ticketChannelName = `ticket-${ticketCount}`;

        guild.channels
            .create(ticketChannelName, {
                type: 'GUILD_TEXT',
                parent: category,
                permissionOverwrites: [{
                        id: guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: member.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: allowedRole.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: adminRole.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                    },
                ],
            })
            .then((channel) => {
                const closeButton = new MessageButton()
                    .setCustomId('close_ticket')
                    .setLabel('Ticketı Kapat')
                    .setStyle('DANGER');

                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Yeni Ticket')
                    .setDescription(`Ticket oluşturan kullanıcı: ${member}`)
                    .setFooter('Ticket Oluşturuldu');
                embed.setThumbnail('https://cdn.discordapp.com/attachments/1104412013666500630/1116121831942918235/attachment_115998183.png');
                channel.send({
                    content: `<@${member.id}>`,
                    embeds: [embed],
                    components: [{ type: 'ACTION_ROW', components: [closeButton] }],
                });

                interaction.reply({
                    content: `Ticket oluşturuldu: ${channel}`,
                    ephemeral: true,
                });
            })
            .catch((error) => {
                console.error('Ticket oluşturulurken bir hata oluştu:', error);
                interaction.reply({
                    content: 'Ticket oluşturulurken bir hata oluştu.',
                    ephemeral: true,
                });
            });
    } else if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        if (!channel) return;

        channel.delete().catch((error) => {
            console.error('Ticket kapatılırken bir hata oluştu:', error);
            interaction.reply({
                content: 'Ticket kapatılırken bir hata oluştu.',
                ephemeral: true,
            });
        });
    }
});

// Botu Bir Ses Kanalına Sok

const { joinVoiceChannel } = require('@discordjs/voice');
client.on('ready', () => {
    joinVoiceChannel({
        channelId: "1107347629324640390", //Bağlanıcak Kanal İd
        guildId: "1104139398003560488", //Kanalın Olduğu Sunucu İd    
        adapterCreator: client.guilds.cache.get("1104139398003560488").voiceAdapterCreator //Kanalın Olduğu Sunucu İd   
    });
});

// Giriş Yap

client.login(token);