from django.shortcuts import render
import google.generativeai as genai 
import requests
import re
from decouple import config
from django.http import JsonResponse
import json

# Create your views here.
def home(request):
    return render(request, 'base.html')

def chatbot(request):
    if request.method == 'POST':
        meal_type = request.POST.get('meal_type')
        dish_name = request.POST.get('dish_name')
        num_people = request.POST.get('num_people')
        custom_query = request.POST.get('custom_query')
        
        if custom_query is None:
            prompt = f''' 
            Question : I Want to Prepare {dish_name} for Number of People: {num_people} for {meal_type} without wasting any Food Give me Presize Amounts of Food according to Indian Food Standards. 
            Instructions
            1. If the question is not related to food, do not answer.'''
        else:
            prompt = f''' 
            Question : I Want to Prepare {custom_query} 
            Instructions
            1. If the question is not related to food, do not answer.'''
        
        response = ask_gemini(prompt)
        cleaned = clean_ai_markdown(response)
        return render(request, 'chatbot.html', context={'response': cleaned})

    return render(request, 'chatbot.html')

def ask_gemini(prompt):
    # Configure API (consider moving the key to settings/env)
    genai.configure(api_key="AIzaSyDAklJ4QhNmuxjGBleFGpcv5NusJb13C0c")
    model = genai.GenerativeModel('gemini-1.5-flash')
    # generate_content expects a string prompt
    result = model.generate_content(prompt)
    try:
        return result.text
    except Exception:
        # Fallback formatting
        return str(result)

def update_location(request):
    if request.method == 'POST':
        location = request.POST.get('location')

        if not location:
            try:
                data = json.loads(request.body.decode('utf-8') or '{}')
            except Exception:
                data = {}
            location = data.get('location')

        # Debug print after resolving from form or JSON
        print(location)

        if location:
            request.session['saved_location'] = location

        # Return JSON for AJAX
        is_json = request.headers.get('Content-Type', '').startswith('application/json')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        if is_json or is_ajax:
            return JsonResponse({'status': 'ok', 'saved_location': location})

        return render(request, 'donations.html', {
            'manual_form_visible': True,
            'saved_location': location
        })

    return render(request, 'donations.html', {
        'saved_location': request.session.get('saved_location')
    })






# def get_location_data():
#     try:
#         api_key = config("IPSTACKAPIKEY")
#         url = f"http://api.ipstack.com/check?access_key={api_key}"
#         response = requests.get(url)
#         data = response.json()
#         if "error" in data:
#             return {"error": data["error"]["info"]}
#         return {
#             "ip": data.get("ip"),
#             "city": data.get("city"),
#             "region": data.get("region_name"),
#             "country": data.get("country_name"),
#             "latitude": data.get("latitude"),
#             "longitude": data.get("longitude"),
#             "zip": data.get("zip"),
#             "timezone": data.get("time_zone", {}).get("id")
#         }
#     except Exception as e:
#         return {"error": str(e)}

# # Django view that handles the URL and returns JSON response
# def detect_location(request):
#     location_data = get_location_data()
#     return render(request, 'donations.html', context={'location_data' : location_data})




def clean_ai_markdown(text: str) -> str:
    """Convert or strip simple Markdown markers so UI doesn't show raw ** and *.

    - Remove bold markers **...**
    - Convert bullet markers (* or - at line start) to a unicode bullet
    """
    if not text:
        return ""
    # Remove bold markers
    without_bold = text.replace('**', '')
    # Replace leading list markers with bullets
    bulletized = re.sub(r'^\s*[\*-]\s+', '• ', without_bold, flags=re.MULTILINE)
    return bulletized

def about(request):
    return render(request, 'about.html')

def donations(request):
    return render(request, 'donations.html', {
        'saved_location': request.session.get('saved_location')
    })

def future_features(request):
    return render(request, 'future.html')