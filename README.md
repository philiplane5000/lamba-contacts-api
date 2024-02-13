# Contacts API (Lambda, API Gateway, DynamoDB)

## Docker Compose (for local DynamoDB)
```yml
version: '3.8'
services:
 dynamodb-local:
   command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
   image: "amazon/dynamodb-local:latest"
   container_name: dynamodb-local
   ports:
     - "8000:8000"
   volumes:
     - "./docker/dynamodb:/home/dynamodblocal/data"
   working_dir: /home/dynamodblocal
```

## Create the 'Contacts' Table on the locally running DynamoDB
```zsh
aws dynamodb create-table \
    --table-name Contacts \
    --attribute-definitions \
        AttributeName=id,AttributeType=N \
        AttributeName=timestamp,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000
```
