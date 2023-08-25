#!/bin/bash

# chmod +x index-docs.sh
# ./index-docs.sh

url="https://localhost:9200/performance_test/_bulk"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="
content_type="Content-Type: application/x-ndjson"

for i in {1..10}; do
  # Execute curl command to bulk index documents
  # Get docs from file and don't print anything to the console
  curl --location "$url" \
  --request POST \
  --header "$auth" \
  --header "$content_type" \
  --insecure \
  --data-binary "@bulk-$i.json" \
done