#!/bin/bash

# chmod +x index-ten-thousand-docs.sh
# ./index-ten-thousand-docs.sh

# Define arrays of first, middle, and last names, each with 100 elements
first_names=("Emma" "Olivia" "Ava" "Isabella" "Sophia" "Mia" "Charlotte" "Amelia" "Harper" "Evelyn" "Abigail" "Emily" "Elizabeth" "Mila" "Ella" "Avery" "Sofia" "Camila" "Aria" "Scarlett")
first_names+=("Eleanor" "Hannah" "Lillian" "Addison" "Aubrey" "Ellie" "Stella" "Natalie" "Zoey" "Leah" "Hazel" "Violet" "Aurora" "Savannah" "Audrey" "Brooklyn" "Bella" "Claire" "Skylar" "Lucy")
first_names+=("Paisley" "Everly" "Anna" "Caroline" "Nova" "Genesis" "Emilia" "Kennedy" "Samantha" "Maya" "Willow" "Kinsley" "Naomi" "Aaliyah" "Elena" "Sarah" "Ariana" "Allison" "Gabriella" "Alice")
first_names+=("Madelyn" "Cora" "Ruby" "Eva" "Serenity" "Autumn" "Adeline" "Hailey" "Gianna" "Valentina" "Isla" "Eliana" "Quinn" "Nevaeh" "Ivy" "Sadie" "Piper" "Lydia" "Alexa" "Josephine")
first_names+=("Emery" "Julia" "Delilah" "Arianna" "Vivian" "Kaylee" "Sophie" "Brielle" "Madeline" "Peyton" "Rylee" "Clara" "Hadley" "Melanie" "Mackenzie" "Reagan" "Adalynn" "Liliana" "Aubree" "Jade")

#now add 100 more male names to the array
first_names+=("Noah" "Liam" "William" "Mason" "James" "Benjamin" "Jacob" "Michael" "Elijah" "Ethan" "Alexander" "Oliver" "Daniel" "Lucas" "Matthew" "Aiden" "Jackson" "Logan" "David" "Joseph")
first_names+=("Samuel" "Henry" "Owen" "Sebastian" "Gabriel" "Carter" "Jayden" "John" "Luke" "Anthony" "Isaac" "Dylan" "Wyatt" "Andrew" "Joshua" "Christopher" "Grayson" "Jack" "Julian" "Ryan")
first_names+=("Jaxon" "Levi" "Nathan" "Caleb" "Hunter" "Christian" "Isaiah" "Thomas" "Aaron" "Lincoln" "Charles" "Eli" "Landon" "Connor" "Josiah" "Jonathan" "Cameron" "Jeremiah" "Mateo" "Adrian")
first_names+=("Hudson" "Robert" "Nicholas" "Brayden" "Nolan" "Easton" "Jordan" "Colton" "Evan" "Angel" "Asher" "Dominic" "Austin" "Leo" "Adam" "Jace" "Jose" "Ian" "Cooper" "Gavin")
first_names+=("Carson" "Jaxson" "Theodore" "Jason" "Ezra" "Chase" "Parker" "Xavier" "Kevin" "Zachary" "Tyler" "Ayden" "Elias" "Bryson" "Leonardo" "Greyson" "Sawyer" "Roman" "Brandon" "Bentley")

last_names=("Smith" "Johnson" "Williams" "Jones" "Brown" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez" "Hernandez" "Lopez" "Gonzalez" "Perez" "Taylor" "Anderson" "Wilson" "Moore" "Jackson" "Martin")
last_names+=("Lee" "Walker" "Hall" "Allen" "Young" "Hernandez" "King" "Wright" "Lopez" "Hill" "Scott" "Green" "Adams" "Baker" "Gonzalez" "Nelson" "Carter" "Mitchell" "Perez" "Roberts")
last_names+=("Turner" "Phillips" "Campbell" "Parker" "Evans" "Edwards" "Collins" "Stewart" "Sanchez" "Morris" "Rogers" "Reed" "Cook" "Morgan" "Bell" "Murphy" "Bailey" "Rivera" "Cooper" "Richardson")
last_names+=("Cox" "Howard" "Ward" "Torres" "Peterson" "Gray" "Ramirez" "James" "Watson" "Brooks" "Kelly" "Sanders" "Price" "Bennett" "Wood" "Barnes" "Ross" "Henderson" "Coleman" "Jenkins")
last_names+=("Perry" "Powell" "Long" "Patterson" "Hughes" "Flores" "Washington" "Butler" "Simmons" "Foster" "Gonzales" "Bryant" "Alexander" "Russell" "Griffin" "Diaz" "Hayes" "Myers" "Ford" "Hamilton")
  


# make a loop that runs 100 times and prints the index
for j in {1..1000}; do
  # make a variable to keep track of the start time
  docs=""
  echo "" > "bulk-$j.json"
  for i in {1..10000}; do
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
    ucn=$(uuidgen)
    # Build JSON data with documents
    rniNameObject="{\"name\":{\"data\":\"$name\",\"entityType\":\"PERSON\"},\"language\":\"eng\",\"dob\":\"$dob\",\"ucn\":\"$ucn\"}"
    bulkString="{\"index\":{\"_index\":\"performance_test\"}}\n$rniNameObject"
    docs+="$bulkString\n"
  done
  echo -e "$docs" > "bulk-$j.json"
  # now make a variable to keep track of the end time
done
