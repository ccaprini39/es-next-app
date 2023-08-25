#!/bin/bash

# chmod +x run-test.sh
# ./run-test.sh

# first thing this one does is run the stage-performance-test.sh script
# then it runs the index-one-thousand-docs.sh script
# then it runs the average-100-queries-and-save.sh script
# then it saves the results to a file

# run the stage-performance-test.sh script
./stage-performance-test.sh

# first overwrite the output.txt file with a blank string
echo "" > output.txt

# first index to 1000 docs and then run 100 queries and save the results to a file
echo "indexing to 1000 docs and running queries" >> output.txt
./index-one-thousand-docs.sh
# run the average-100-queries-and-save.sh script and append the results to the output variable
./average-100-queries-and-save.sh >> output.txt

# then index to 10000 docs and run 100 queries and save the results to a file
echo "indexing to 10,000 docs and running queries" >> output.txt
# run the index-one-thousand-docs.sh script 9 times
for i in {1..9}; do
  ./index-one-thousand-docs.sh
done
# run the average-100-queries-and-save.sh script and append the results to the output variable
./average-100-queries-and-save.sh >> output.txt

# then index to 100,000 docs and run 100 queries and save the results to a file
echo "indexing to 100,000 docs and running queries" >> output.txt
# run the index-one-thousand-docs.sh script 90 times
for i in {1..90}; do
  ./index-one-thousand-docs.sh
done
# run the average-100-queries-and-save.sh script and append the results to the output variable
./average-100-queries-and-save.sh >> output.txt

# then index to 1,000,000 docs and run 100 queries and save the results to a file
echo "indexing to 1,000,000 docs and running queries" >> output.txt
# run the index-one-thousand-docs.sh script 900 times
for i in {1..900}; do
  ./index-one-thousand-docs.sh
done  
# run the average-100-queries-and-save.sh script and append the results to the output variable
./average-100-queries-and-save.sh >> output.txt

# then index to 10,000,000 docs and run 100 queries and save the results to a file
echo "indexing to 10,000,000 docs and running queries" >> output.txt
# run the index-one-thousand-docs.sh script 9000 times
for i in {1..9000}; do
  ./index-one-thousand-docs.sh
done
# run the average-100-queries-and-save.sh script and append the results to the output variable
./average-100-queries-and-save.sh >> output.txt





