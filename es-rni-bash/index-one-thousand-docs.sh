#!/bin/bash

# chmod +x index-one-thousand-docs.sh
# ./index-one-thousand-docs.sh

# Define variables
url="https://localhost:9200/performance_test/_bulk"
auth="Authorization: Basic ZWxhc3RpYzpSbWUxcG5KSkdNaWE4ZGcwZEJPbQ=="
content_type="Content-Type: application/x-ndjson"

# make a variable to keep track of the start time
start=$(date +%s)

echo -e "" > docs.json

# Generate 100 documents
for i in {1..10000}; do
  # Generate random name
  # Define arrays of first, middle, and last names
  first_names=("Emma" "Olivia" "Ava" "Isabella" "Sophia" "Mia" "Charlotte" "Amelia" "Harper" "Evelyn" "Abigail" "Emily" "Elizabeth" "Mila" "Ella" "Avery" "Sofia" "Camila" "Aria" "Scarlett")
  last_names=("Smith" "Johnson" "Williams" "Jones" "Brown" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez" "Hernandez" "Lopez" "Gonzalez" "Perez" "Taylor" "Anderson" "Wilson" "Moore" "Jackson" "Martin")

  # Generate random name
  first_name=${first_names[$RANDOM % ${#first_names[@]} ]}
  middle_name=${first_names[$RANDOM % ${#first_names[@]} ]}
  last_name=${last_names[$RANDOM % ${#last_names[@]} ]}
  name="$first_name $middle_name $last_name"

  # Generate random dob with constraints
  year=$(shuf -i 1900-2023 -n 1)
  month=$(printf "%02d" $(shuf -i 1-12 -n 1))
  day=$(printf "%02d" $(shuf -i 1-28 -n 1))
  dob="$year$month$day"

  # Generate random ucn
  ucn=$(cat /dev/urandom | tr -dc '0-9' | fold -w 10 | head -n 1)

  # Build JSON data with documents
  rniNameObject="{\"name\":{\"data\":\"$name\",\"entityType\":\"PERSON\"},\"dob\":\"$dob\",\"ucn\":\"$ucn\"}"
  bulkString="{\"index\":{\"_index\":\"performance_test\"}}\n$rniNameObject"
  echo -e "$bulkString" >> docs.json
done

# Add an actual newline, not the newline character, after the last document
echo "\n" >> docs.json

# Execute curl command to bulk index documents
# Get docs from file and don't print anything to the console
curl --location "$url" \
--request POST \
--header "$auth" \
--header "$content_type" \
--insecure \
--data-binary "@docs.json" \
-s > /dev/null

# now make a variable to keep track of the end time
end=$(date +%s)

# now calculate the difference between the start and end time
difference=$((end-start))

# now print the difference
echo "Indexing 10000 docs took $difference seconds"