#!/usr/bin/env bash

display_usage() { 
	echo "This script generates a colourful .gif from input data in /input/<year> and saves it in ./output/finished" 
	echo -e "Usage: $0 <output-filename> <year>" 
	} 

if [  $# -le 1 ]; then 
    display_usage
    exit 1
fi 

# Assumes .nc data has been downloaded and saved here 
cd input/$2

# Don't do this again if the output already there - this is slow and shouldn't change
# unless the input files have changed for some reason
if [ ! -f combo.nc ]; then
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Merging monthly inputs into one"
    cdo mergetime $(ls -1 *.nc | sort -V) combo.nc
fi


echo  "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Cleaning out previous files"
cd ../../output/bw
rm *.tif 2> /dev/null
cd ../colourised
rm *.tif *.gif 2> /dev/null


echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Running python file to produce daily tifs"
cd ../../
python3 ./process_data_and_create_rasters.py $2


echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Applying colour"
cd output/bw
for i in $(ls -1 *.tif | sort -V); do
    gdaldem color-relief -alpha $i ../../colour-relief.txt ../colourised/$i -q;
done

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Converting to .gifs"
cd ../colourised
for i in $(ls -1 *.tif | sort -V); do
    month=$(echo $i | rev | cut -d'-' -f 1 | rev | cut -d'.' -f1)
    convert $i -gravity SouthWest -pointsize 42 -fill black -annotate +50+50 "$month" -quiet -resize 30% $i.gif;
done


echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Stitching together to final output"
convert -delay 4 -loop 0 $(ls -1 *.gif | sort -V) ../finished/$2-$1.gif


echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Creating compressed version"
cd ../finished/
gifsicle -O3 $2-$1.gif -o $2-$1-small.gif


echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ---- Done!"
echo "file://$(pwd)/$2-$1.gif"
echo "file://$(pwd)/$2-$1-small.gif"