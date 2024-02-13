import { DynamoDBClient, DescribeTableCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { formatResponse, formatError, serialize } from './utils/index.mjs';

// Lambda handler
export const handler = async (event, context) => {
  const { path, httpMethod, body = {} } = event;

  // Create a DynamoDB client
  const client = new DynamoDBClient();

  // console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  // console.log('## CONTEXT: ' + serialize(context));
  // console.log('## EVENT: ' + serialize(event));

  /* The root route */
  if (path === '/' && httpMethod === 'GET') {
    // DescribeTableInput
    const input = {
      TableName: 'Contacts', // required
    };

    const command = new DescribeTableCommand(input);
    try {
      const response = await client.send(command);
      return formatResponse(serialize(response));
    } catch (error) {
      console.error('Error describing DynamoDB table:', error);
      return formatError(error);
    }
  }

  if (path === '/contact' && httpMethod === 'POST') {
    const requestBody = JSON.parse(body);

    const { firstName = '', lastName = '', email = '', message = '' } = requestBody;

    /** @type {number} */
    const timestamp = Math.floor(new Date().getTime());

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
      TableName: 'Contacts',
      Item: item,
    };

    // Create the PutItemCommand
    const command = new PutItemCommand(input);

    // Send the command to put the item into the table
    try {
      const response = await client.send(command);
      return formatResponse(serialize(response));
    } catch (error) {
      console.error('Error putting item into DynamoDB:', error);
      return formatError(error);
    }
  }

  if (path === '/ping' && httpMethod === 'GET') {
    return formatResponse({ message: 'pong' });
  }
};
