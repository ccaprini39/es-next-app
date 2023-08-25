#!/bin/bash

# chmod +x simple-single-query.sh
# ./simple-single-query.sh

# Define variables
url="https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/performance_test/_search"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="
content_type="Content-Type: application/json"
data='{
  "explain": false,
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "name": "\\{\\n    \"data\": \"BUGS BUNNY\",\\n    \"entityType\": \"PERSON\"\\n\\}"
          }
        },
        {
          "match": {
            "dob": "19400430"
          }
        }
      ]
    }
  },
  "rescore": {
    "query": {
      "rescore_query": {
        "function_score": {
          "doc_score": {
            "fields": {
              "name": {
                "query_value": {
                  "data": "BUGS BUNNY",
                  "entityType": "PERSON"
                }
              },
              "dob": {
                "query_value": "19400430"
              }
            }
          }
        }
      },
      "query_weight": 0.0,
      "rescore_query_weight": 1.0
    }
  }
}'

# Execute curl command and output response
response=$(curl --location "$url" \
--header "$auth" \
--insecure \
--header "$content_type" \
--data "$data" | jq '.took')

echo "$response"