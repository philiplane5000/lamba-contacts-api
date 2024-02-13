#!/bin/bash
set -eo pipefail
ARTIFACT_BUCKET=$(cat bucket-name.txt)
aws cloudformation package --template-file template.json --s3-bucket $ARTIFACT_BUCKET --output-template-file out.json
aws cloudformation deploy --template-file out.json --stack-name nodejs-lambda-api --capabilities CAPABILITY_NAMED_IAM
