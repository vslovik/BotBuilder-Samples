var util = require('util');
var rp = require('request-promise');
var LuisActions = require('../core');

var ApixuApiKey = process.env.APIXU_API_KEY;

var SogettiInPlaceAction = {
    intentName: 'cerca_qualcosa',
    friendlyName: 'Cosa stai cercando?',
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        soggetto: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Encyclopedia.Person, // LuisActions.BuiltInTypes.Encyclopedia.Organization
            message: 'Cosa fa la Cartotecnica Tiberina?'
        }
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        rp({
            url: util.format('http://api.apixu.com/v1/current.json?key=%s&q=%s', ApixuApiKey, encodeURIComponent(parameters.Place)),
            json: true
        }).then(function (data) {
            if (data.error) {
                callback(data.error.message + ': "' + parameters.Place + '"');
            } else {
                callback(util.format('The current weather in %s, %s is %s (humidity %s %%)',
                    data.location.name, data.location.country, data.current.condition.text, data.current.humidity));
            }
        }).catch(console.error);
    }
};

module.exports = SogettiInPlaceAction;