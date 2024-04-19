module.exports = async function (context, eventHubMessages) {

    context.log('context.bindingData',  context.bindingData);

    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    const appInsights = require("applicationinsights");
    appInsights.setup(process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]).start();
    const client = appInsights.defaultClient;


    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${message}`);

        // Attempt to parse the string as JSON
        var result = JSON.parse(message);
        client.trackEvent({name: "customEvent From jhl-eventhub", properties: result});
    });
};