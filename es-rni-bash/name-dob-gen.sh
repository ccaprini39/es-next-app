#!/bin/bash

# chmod +x name-dob-gen.sh
# ./name-dob-gen.sh

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

# Output name and dob
echo "Name: $name"
echo "DOB: $dob"