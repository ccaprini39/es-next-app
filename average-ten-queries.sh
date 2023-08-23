#!/bin/bash

# Define variables
url="https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/performance_test/_search"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="
content_type="Content-Type: application/json"

echo "Running 10 queries..."
# Execute curl command 10 times and save took values to array
declare -a took_values
for i in {1..10}; do
  # Generate random name and dob
  name=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

  # Generate random dob with constraints
  year=$(shuf -i 1900-2023 -n 1)
  month=$(printf "%02d" $(shuf -i 1-12 -n 1))
  day=$(printf "%02d" $(shuf -i 1-28 -n 1))
  dob="$year$month$day"

  # Build JSON data with random name and dob
  data='{
    "explain": false,
    "query": {
      "bool": {
        "should": [
          {
            "match": {
              "name": "\\{\\n    \"data\": \"'$name'\",\\n    \"entityType\": \"PERSON\"\\n\\}"
            }
          },
          {
            "match": {
              "dob": "'$dob'"
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
                    "data": "'$name'",
                    "entityType": "PERSON"
                  }
                },
                "dob": {
                  "query_value": "'$dob'"
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

  # Execute curl command and save took value to array
  took=$(curl -s --location "$url" \
  --header "$auth" \
  --insecure \
  --header "$content_type" \
  --data "$data" | jq '.took')
  took_values+=("$took")
  # echo "Query $i took $took ms"
done

# Calculate average of took values
total=0
for took in "${took_values[@]}"; do
  total=$(echo "$total + $took" | bc)
done
average=$(echo "scale=2; $total / ${#took_values[@]}" | bc)

# Output average
echo "Average took time for 10 queries: $average ms"