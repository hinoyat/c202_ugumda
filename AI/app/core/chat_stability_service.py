from dotenv import load_dotenv
import requests
import os

from openai import api_key

load_dotenv()

def stability(prompt:str):
    api_key = os.getenv("STABILITY_API_KEY")
    response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/generate/sd3",

        headers={
            "authorization": f"Bearer {api_key}",
            "accept": "application/json"
        },
        files={"none": ''},
        data={
            "prompt": {prompt},
            "output_format": "png",
        },
    )

    # log 찍기

    if response.status_code == 200:
        return response.content
    else:
        raise Exception(str(response.json()))
