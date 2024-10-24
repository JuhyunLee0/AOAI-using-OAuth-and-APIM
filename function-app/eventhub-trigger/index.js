const { Client } = require('pg');

module.exports = async function (context, eventHubMessages) {

    // context.log('context.bindingData',  context.bindingData);

    // context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    // const appInsights = require("applicationinsights");
    // appInsights.setup(process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]).start();
    // const client = appInsights.defaultClient;


    // eventHubMessages.forEach((message, index) => {
    //     context.log(`Processed message ${message}`);

    //     // Attempt to parse the string as JSON
    //     var result = JSON.parse(message);
    //     client.trackEvent({name: "customEvent From jhl-eventhub", properties: result});
    // });

    // Connect to PostgreSQL Database
    const client = new Client({
        host: 'jhl-postgres-server.postgres.database.azure.com',
        port: 5432,
        database: 'apim-usage',
        user: 'jhladmin',
        password: process.env["PG_PASSWORD"],
        ssl: {
            rejectUnauthorized: false
        }
    });

    await client.connect();

    for(let i = 0; i < eventHubMessages.length; i++){
        let message = eventHubMessages[i];
        context.log(`Processing message ${message}`);

        // Attempt to parse the string as JSON
        var data = JSON.parse(message);
        // Extract values from the JSON message
        const apimRequestId = data["apim-request-id"];
        const appKey = data["app-key"];
        const timestamp = data["timestamp"];
        const apiOperation = data["api-operation"];
        const promptTokens = data["prompt-tokens"];
        const completionTokens = data["completion-tokens"];
        const totalTokens = data["total-tokens"];
        const principalName = data["principal-name"];

        // Insert JSON data into PostgreSQL table
        const query = `INSERT INTO apim_usage_log (apim_request_id, app_key, timestamp, api_operation, prompt_tokens, completion_tokens, total_tokens, principal_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [apimRequestId, appKey, timestamp, apiOperation, promptTokens, completionTokens, totalTokens, principalName];

        await client.query(query, values);

    }

    await client.end();
};