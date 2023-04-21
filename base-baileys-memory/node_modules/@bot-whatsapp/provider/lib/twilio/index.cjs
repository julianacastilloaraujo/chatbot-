/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$1 = require('twilio');
var require$$1$1 = require('@bot-whatsapp/bot');
var require$$0 = require('node:events');
var require$$1 = require('polka');
var require$$2 = require('body-parser');

const parseNumber$2 = (number) => {
    return `${number}`.replace('whatsapp:', '').replace('+', '')
};

var utils = { parseNumber: parseNumber$2 };

const { EventEmitter } = require$$0;
const polka = require$$1;
const { urlencoded } = require$$2;
const { parseNumber: parseNumber$1 } = utils;

/**
 * Encargado de levantar un servidor HTTP con una hook url
 * [POST] /twilio-hook
 */
let TwilioWebHookServer$1 = class TwilioWebHookServer extends EventEmitter {
    twilioServer
    twilioPort
    constructor(_twilioPort) {
        super();
        this.twilioServer = this.buildHTTPServer();
        this.twilioPort = _twilioPort;
    }

    /**
     * Mensaje entrante
     * emit: 'message'
     * @param {*} req
     * @param {*} res
     */
    incomingMsg = (req, res) => {
        const { body } = req;
        this.emit('message', {
            from: parseNumber$1(body.From),
            to: parseNumber$1(body.To),
            body: body.Body,
        });
        const json = JSON.stringify({ body });
        res.end(json);
    }

    /**
     * Contruir HTTP Server
     * @returns
     */
    buildHTTPServer = () => {
        return polka()
            .use(urlencoded({ extended: true }))
            .post('/twilio-hook', this.incomingMsg)
    }

    /**
     * Puerto del HTTP
     * @param {*} port default 3000
     */
    start = () => {
        this.twilioServer.listen(this.twilioPort, () => {
            console.log(``);
            console.log(`[Twilio]: Agregar esta url "WHEN A MESSAGE COMES IN"`);
            console.log(`[Twilio]: POST http://localhost:${this.twilioPort}/twilio-hook`);
            console.log(`[Twilio]: Más información en la documentacion`);
            console.log(``);
        });
        this.emit('ready');
    }
};

var server = TwilioWebHookServer$1;

const twilio = require$$0$1;
const { ProviderClass } = require$$1$1;

const TwilioWebHookServer = server;
const { parseNumber } = utils;

/**
 * ⚙️TwilioProvider: Es un provedor que te ofrece enviar
 * mensaje a Whatsapp via API
 * info: https://www.twilio.com/es-mx/messaging/whatsapp
 * video: https://youtu.be/KoOmsHylxUw
 *
 * Necesitas las siguientes tokens y valores
 * { accountSid, authToken, vendorNumber }
 */

const PORT = process.env.PORT || 3000;

class TwilioProvider extends ProviderClass {
    twilioHook
    vendor
    vendorNumber
    constructor({ accountSid, authToken, vendorNumber, port = PORT }) {
        super();
        this.vendor = new twilio(accountSid, authToken);
        this.twilioHook = new TwilioWebHookServer(port);
        this.vendorNumber = parseNumber(vendorNumber);

        this.twilioHook.start();
        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.twilioHook.on(event, func);
        }
    }

    /**
     * Mapeamos los eventos nativos de  whatsapp-web.js a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'auth_failure',
            func: (payload) => this.emit('error', payload),
        },
        {
            event: 'ready',
            func: () => this.emit('ready', true),
        },
        {
            event: 'message',
            func: (payload) => {
                this.emit('message', payload);
            },
        },
    ]

    /**
     * Enviar un archivo multimedia
     * https://www.twilio.com/es-mx/docs/whatsapp/tutorial/send-and-receive-media-messages-whatsapp-nodejs
     * @private
     * @param {*} number
     * @param {*} mediaInput
     * @returns
     */
    sendMedia = async (number, message, mediaInput = null) => {
        if (!mediaInput) throw new Error(`MEDIA_INPUT_NULL_: ${mediaInput}`)
        number = parseNumber(number);
        return this.vendor.messages.create({
            mediaUrl: [`${mediaInput}`],
            body: message,
            from: `whatsapp:+${this.vendorNumber}`,
            to: `whatsapp:+${number}`,
        })
    }

    /**
     * Enviar botones
     * https://www.twilio.com/es-mx/docs/whatsapp/buttons
     * @private
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    sendButtons = async () => {
        this.emit(
            'notice',
            [
                `[NOTA]: Actualmente enviar botons con Twilio esta en desarrollo`,
                `[NOTA]: https://www.twilio.com/es-mx/docs/whatsapp/buttons`,
            ].join('\n')
        );
    }

    /**
     *
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (number, message, { options }) => {
        number = parseNumber(number);
        if (options?.buttons?.length) this.sendButtons(number, message, options.buttons);
        if (options?.media) return this.sendMedia(number, message, options.media)
        return this.vendor.messages.create({
            body: message,
            from: `whatsapp:+${this.vendorNumber}`,
            to: `whatsapp:+${number}`,
        })
    }
}

var twilio_1 = TwilioProvider;

module.exports = twilio_1;
