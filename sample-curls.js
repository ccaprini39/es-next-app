const sampleQuery = `
curl --location 'https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/performance_test/_search' \
--header 'Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ==' \
--insecure \
--header 'Content-Type: application/json' \
--data '{
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
`