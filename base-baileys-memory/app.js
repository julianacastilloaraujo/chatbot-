/** (1) SECCION IMPORTACIONES CHAT TECNM */
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')

const MockAdapter = require('@bot-whatsapp/database/mock')

const conversacionInicial = addKeyword('hola').addAnswer('Hola, bienvenido al chatbot del TECNM 🇲🇽')
/** (2) DEFINICION LA FUNCION PRINCIPAL */
const main = async () => {
    const adapterDB = new MockAdapter()

    const adapterProvider = createProvider(BaileysProvider)

    const adapterFlow = createFlow([conversacionInicial])

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}


main()
