#!/usr/bin/env bash

# TODO add xargs
if [ -z "$1" ]; then
    echo "need to pass output filename"
    exit 1
fi

if [ -z "$2" ]; then
    echo "need to pass year"
    exit 1
fi

# pull down data files
# combine with cdo tool
cd 1km/$2

if [ ! -f combo.nc ]; then
    echo "---- Merging monthly inputs into one"
    cdo mergetime $(ls -1 *.nc | sort -V) combo.nc
fi

cd ../../output

echo  "---- Cleaning out previous files"
rm *.tif 2> /dev/null
cd hillshade
rm *.tif *.gif 2> /dev/null

cd ../../

echo "---- Running python file to produce daily tifs"
python3 ./new-week-new-beginnings.py $2


echo "---- Applying colour"
cd output 
# -z: Vertical exaggeration used to pre-multiply the elevations
# other file had 5000
for i in $(ls -1 *.tif | sort -V); do
    # gdaldem hillshade -q "$i" ./hillshade/$i;
    gdaldem color-relief -alpha $i ../colour-relief.txt ./hillshade/$i -q;
done


echo "---- Converting to .gifs"
cd hillshade
for i in $(ls -1 *.tif | sort -V); do
    month=$(echo $i | rev | cut -d'-' -f 1 | rev | cut -d'.' -f1)
    convert $i -gravity SouthWest -pointsize 42 -fill black -annotate +50+50 "$month" -quiet -resize 30% $i.gif;
done

echo "---- Stitching together to final output"

convert -delay 4 -loop 0 $(ls -1 *.gif | sort -V) ../../$2-$1.gif

cd ../../

echo "---- Creating compressed version"
gifsicle -O3 $2-$1.gif -o $2-$1-small.gif


echo "---- Done!"
echo "file://$(pwd)/$2-$1.gif"
echo "file://$(pwd)/$2-$1-small.gif"