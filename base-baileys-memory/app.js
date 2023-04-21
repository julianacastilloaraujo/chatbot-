/** (1) SECCION IMPORTACIONES CHAT TECNM */
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')

const MockAdapter = require('@bot-whatsapp/database/mock')

const conversacionInicial = addKeyword('Hola', 'hola', 'buenas', 'ey', 'hey').addAnswer('Hola, bienvenido al chatbot TECNM como ayuda de prevencion hacia "Depresion y Suicidio" en el Instituto Tecnologico de Merida ubicado en el estado de Yucatán, México')
/** conversacionInicial es el primer flow (flujo conversacional del chatbot) */
/** conversacionInicial es el primer flow ([Arrays]) en addKeyword */

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
