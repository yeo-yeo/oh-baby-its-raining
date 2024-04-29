# Renaming input files

`for f in *.nc; do mv "$f" "$(echo "$f" | sed s/rainfall_hadukgrid_uk_1km_day_//)"; done`

# Moving bulk downloaded files

```
for file in *.nc;
 do
    directory=${file:0:4}
    if [[ -d $directory ]]; then
        mv "$file" "$directory/"
    else
        echo "$directory not found"
    fi
done
```

for file in ./python/output/finished/*-small.gif; do mv "$file" ./client/public/gifs; done;