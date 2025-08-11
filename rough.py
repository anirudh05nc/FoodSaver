import requests

def get_location(api_key):
    url = f"http://api.ipstack.com/check?access_key=ddbf8b147a405f405e4efaa9c97bb816"
    response = requests.get(url)
    data = response.json()
    if "error" in data:
        return f"Error: {data['error']['info']}"
    return {
        "ip": data.get("ip"),
        "city": data.get("city"),
        "region": data.get("region_name"),
        "country": data.get("country_name"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "zip": data.get("zip"),
        "timezone": data.get("time_zone", {}).get("id")
    }

# Replace 'YOUR_API_KEY' with your actual ipstack API key
api_key = "YOUR_API_KEY"
location = get_location(api_key)

print("Location Details:")
for key, value in location.items():
    print(f"{key.capitalize()}: {value}")
