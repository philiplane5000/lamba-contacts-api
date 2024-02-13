import { DynamoDBClient, DescribeTableCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { formatResponse, formatError, serialize } from './utils/index.mjs';

/** @type {string} */
const TABLE_NAME = process.env.TABLE_NAME;

// Lambda handler
export const handler = async (event, context) => {
  const { path, httpMethod, body } = event;
  //   console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  //   console.log('## EVENT: ' + serialize(event));
  //   console.log('## CONTEXT: ' + serialize(context));

  // GET "/ping" returns "pong" as a health check
  if (path === '/status' && httpMethod === 'GET') {
    const statusMessage = { status: 'ok' };
    return formatResponse(JSON.stringify(statusMessage));
  }

  // GET "/" returns result of describe table
  if (path === '/describe' && httpMethod === 'GET') {
    // DescribeTableInput
    const input = {
      TableName: TABLE_NAME, // required
    };

    const command = new DescribeTableCommand(input);
    try {
      // Create a DynamoDB client
      const client = new DynamoDBClient();
      const response = await client.send(command);

      return formatResponse(serialize(response));
    } catch (error) {
      console.error('Error describing table:', error);
      return formatError(error);
    }
  }

  // POST "/contact" adds a new item to the table
  if (path === '/contact' && httpMethod === 'POST') {
    const requestBody = JSON.parse(body),
      { firstName = '', lastName = '', email = '', message = '' } = requestBody;

    /** @type {number} */
    const timestamp = Math.floor(new Date().getTime());
    console.info('Timestamp >> ', timestamp);

    // Define the item to be put into the table
    const item = {
      id: { N: '0' }, // Assuming 'id' is a numeric attribute
      firstName: { S: firstName },
      lastName: { S: lastName },
      email: { S: email },
      message: { S: message },
      timestamp: { N: timestamp.toString() },
    };

    // Define the input for the PutItemCommand
    const input = {
      TableName: TABLE_NAME,
      Item: item,
    };

    // Create the PutItemCommand
    const command = new PutItemCommand(input);

    // Send the command to put the item into the table
    try {
      // Create a DynamoDB client
      const client = new DynamoDBClient();
      const response = await client.send(command);

      return formatResponse(serialize(response));
    } catch (error) {
      console.error('Error putting item into table:', error);
      return formatError(error);
    }
  }
};
