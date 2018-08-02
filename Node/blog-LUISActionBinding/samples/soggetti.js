var util = require('util');
var rp = require('request-promise');
var LuisActions = require('../core');
const xml = require("xml-parse");

var SogettiInPlaceAction = {
    intentName: 'cerca_qualcosa',
    friendlyName: 'Cosa stai cercando?',
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        soggetto: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Encyclopedia.Person, // LuisActions.BuiltInTypes.Encyclopedia.Organization
            message: 'Cosa fa la Cartotecnica Tiberina?'
        },
        campi_solr: {
            type: 'string',
            optional: true
        }
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback, ...rest) {

        console.log(parameters, callback, rest);


        if(parameters.soggetto) {
            var campi_solr = parameters.campi_solr ? parameters.campi_solr : 'persona';
            var soggetto = parameters.soggetto;

            var field;
            switch(parameters.campi_solr) {
                case 'person':
                    field = 'ne_norm_person';
                    break;
                case 'azienda':
                    field = 'ne_norm_aziende';
                    break;
                case 'organizzazione':
                    field = 'ne_norm_group';
                    break;
                default:
                    field = 'ne_norm_person';
            }

            url = "http://xxx?q=" + field + ":" + "\"" + encodeURIComponent(parameters.soggetto.toUpperCase()); // Replace xxx by endpoint of service

            console.log('Chiamata al servizio remoto:', url);

            rp({
                url: url,
                json: true
            }).then(function (data) {

                var xmlDoc = new xml.DOM(xml.parse(data));

                var result = xmlDoc.document.getElementsByTagName("result")[0];

                console.log('Risposta: ', data);
                console.log('Numero di record trovati : ', result.attributes.numFound);

                if (data.error) {
                    callback(data.error.message);
                } else {
                    callback(util.format('Query: Il numero di record trovati è %s', result.attributes.numFound));
                }

            }).catch(console.error);
        }
    }
};

module.exports = SogettiInPlaceAction;