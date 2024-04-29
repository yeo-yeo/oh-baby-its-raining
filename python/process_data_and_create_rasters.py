#!/usr/bin/env python3

from netCDF4 import Dataset
import numpy as np
import rasterio
from rasterio.transform import from_origin
import sys
from datetime import datetime

# The data uses an old school way to represent null - by setting an absurdly large value
RAIN_FILL_VALUE = 1e+20

def process_data(year):
    # Load the combined .nc file
    data = Dataset(f"./input/{year}/combo.nc", "r", format="NETCDF4") 

    print(f'---- Processing input data')
    r = np.asarray(data.variables["rainfall"])
    # Convert 'nulls' to -1 so they can be easily differentiated in colour later
    # The colourisation scale is set so they'll all be the same grey even though
    # they'll get summed up to -365
    rf = np.where(r == RAIN_FILL_VALUE, -1, r)
    cumulative_rainfall = np.cumsum(rf, axis=0)

    flat = []
    
    for i in cumulative_rainfall[-1]:
        for j in i:
            if j >= 0:
                flat.append(j)
 
    # May be useful for improving the colour-relief.txt scale
    print('Stats at end of year:')
    print('Min rainfall', np.min(flat)) 
    print('25th percentile', np.percentile(flat,25))
    print('Median', np.percentile(flat,50)) 
    print('75th percentile', np.percentile(flat,75))
    print('Max rainfall', np.max(flat))

    # Create a new dataset and write the cumulative rainfall into it
    new_dataset = Dataset(f'new_dataset_combo.nc', 'w')
    for name, dimension in data.dimensions.items():
        new_dataset.createDimension(name, len(dimension) if not dimension.isunlimited() else None)

    for name, variable in data.variables.items():
        new_var = new_dataset.createVariable(name, variable.dtype, variable.dimensions)
        new_var[:] = variable[:]

    new_dataset.variables['rainfall'][:] = cumulative_rainfall
    lat = new_dataset.variables['latitude'][:]
    lon = new_dataset.variables['longitude'][:]
    num_days = len(new_dataset.variables['time']) 

    print(num_days, 'days found (if 366, will drop leap day)')
    
    for day in range(num_days):
    # Little hack: drop leap days to keep animation lengths equal.  This assumes that when a year
    # of data is being analysed it is starting from January 1.  Not that it really matters.
        if num_days == 366 and day == 29:
            continue

        rainfall = new_dataset.variables['rainfall'][day,:,:]

        # Otherwise it's upside down
        rainfall = np.flipud(rainfall)

        lon_min = lon.min()
        lon_max = lon.max()
        lat_min = lat.min()
        lat_max = lat.max()
        lon_res = (lon_max - lon_min) / len(lon)
        lat_res = (lat_max - lat_min) / len(lat)

        transform = from_origin(lon_min, lat_max, lon_res, lat_res)
 
        date = datetime.strptime(str(day + 1), '%j')
        month_name = date.strftime('%B')

        # Create a GeoTIFF raster for the day's data
        with rasterio.open(f'output/bw/raster-{year}-{str(day).zfill(3)}-{month_name}.tif', 'w', driver='GTiff', width=rainfall.shape[1], height=rainfall.shape[0], count=1, dtype=str(rainfall.dtype),
                        crs='+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs', transform=transform) as output:
            output.write(rainfall, 1)

if __name__ == "__main__":
    year = sys.argv[1]
    if not year:
        print('must pass in year')
        sys.exit(1)
    process_data(year)

