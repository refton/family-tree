# Created by gam at 20.07.2022
pip install geopy
from geopy.geocoders import Nominatim
loc = Nominatim(user_agent="GetLoc")
getLoc = loc.geocode("Moscow")
print("Latitude = ", getLoc.latitude, "\n")
print("Longitude = ", getLoc.longitude)
