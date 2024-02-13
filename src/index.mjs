import { DynamoDBClient, DescribeTableCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { formatResponse, formatError, serialize } from './utils/index.mjs';
import { v4 as uuidv4 } from 'uuid';

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
    /**
     * Represents the request body object.
     * @typedef {Object} RequestBody
     * @property {string} firstName - The first name.
     * @property {string} lastName - The last name.
     * @property {string} email - The email address.
     * @property {string} message - The message.
     */

    /** @type {RequestBody} */
    const requestBody = JSON.parse(body);

    // See RequestBody type definition above
    const { firstName = '', lastName = '', email = '', message = '' } = requestBody;

    /** @type {number} */
    const timestamp = Math.floor(new Date().getTime());

    /** @type {string} */
    const uniqueId = uuidv4(); // (eg) '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    // Define the item to be put into the table
    const item = {
      id: { S: uniqueId },
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
