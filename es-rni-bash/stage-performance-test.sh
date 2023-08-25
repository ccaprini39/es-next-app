#!/bin/bash

# chmod +x stage-performance-test.sh
# ./stage-performance-test.sh

# Define variables
initUrl="https://localhost:9200/_cat/indices?format=json&pretty=true&h=index"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="

# First fetch every index and then iterate over that list and delete them individually
# Get all indices

# Execute curl request and save the index names as a comma separated string
indices=""

response=$(curl -s --location "$initUrl" \
--header "$auth" \
--insecure) 



indices=$(echo "$response" | jq -r '.[].index' | paste -sd "," -)

#now run a curl that deletes all of them
# like this, but with the comma seperated string and the  curl -X DELETE "localhost:9200/performance_test,performance_test_1?pretty"
baseUrl="https://localhost:9200/"
deleteUrl="$baseUrl$indices"
curl -X DELETE "$deleteUrl?pretty" \
--header "$auth" \
--insecure \
-s 

index="performance_test"
# Create index with mapping
curl --location "$baseUrl$index" \
--request PUT \
--header "$auth" \
--insecure \
--header "Content-Type: application/json" \
--data-binary @rni-mapping.json



