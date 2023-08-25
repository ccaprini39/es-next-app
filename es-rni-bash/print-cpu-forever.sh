#!/bin/bash

# chmod +x print-cpu-forever.sh
# ./print-cpu-forever.sh

# Define variables
url="https://ec2-3-141-218-94.us-east-2.compute.amazonaws.com:9200/_cat/nodes?h=cpu*"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="

# Loop and execute curl request every 500ms
while true; do
  # Execute curl request and output results
  curl -s --location "$url" \
  --header "$auth" \
  --insecure \
  | awk '{print $1 "% cpu"}'

  sleep 0.5
done