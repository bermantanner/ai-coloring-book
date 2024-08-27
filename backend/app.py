import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS

# Load environment
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = Flask(__name__)
CORS(app) # Not too sure what this is doing, but this allows fetch requests from the browser. 
          # I was getting a CORS error, and this is the solution I found online.

@app.route('/')
def home():
    return jsonify(message="AI Coloring Book API")

@app.route('/generate-line-drawing', methods=['POST'])
def generate_line_drawing():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify(error="No prompt provided"), 400

    try:
        # The line drawing "parameter", (there's probably a better way).
        full_prompt = f"I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS, and make sure this is a SIMPLE LINE DRAWING WITH NO COLOR: {prompt}"
        # OpenAI API
        response = client.images.generate(
            model="dall-e-3",
            prompt=full_prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )

        # Get the image URL from the response
        image_url = response.data[0].url

        return jsonify(image_url=image_url), 200

    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
