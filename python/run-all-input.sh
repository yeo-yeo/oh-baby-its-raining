# for dir in input/*/; do
#     year=${dir:6:4}
#     echo "Processing $year"
#     ./main.sh final-analysis $year
# done


for year in {1951..2022}; do
    echo "Processing $year"
    ./main.sh final-analysis $year
done