export const formatResponse = body => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  };
  return response;
};

export const formatError = error => {
  const response = {
    statusCode: error.statusCode,
    headers: {
      'Content-Type': 'text/plain',
      'x-amzn-ErrorType': error.code,
    },
    isBase64Encoded: false,
    body: error.code + ': ' + error.message,
  };
  return response;
};

export const serialize = object => {
  return JSON.stringify(object, null, 2);
};
