import os
from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS

import cv2
import numpy as np
import requests


# Load environment
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app = Flask(__name__)
CORS(app) # Not too sure what this is doing, but this allows fetch requests from the browser. 
          # I was getting a CORS error, and this is the solution I found online.

# Function to remove white background -- used online resources heavily.
def remove_background(image_url):
    # Downloading image
    # (downloads an image from a URL, 
    # converts the raw binary data into a NumPy array, 
    # and decodes into OpenCV-compatible image format.)
    response = requests.get(image_url)
    img_array = np.array(bytearray(response.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)

    # Converting to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Applying a binary threshold to make the background white (255) and the lines black (0)
    _, thresholded = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)

    # Creating an alpha channel based on the thresholded image
    alpha_channel = thresholded

    # Splitting the original image into its BGR channels
    b, g, r = cv2.split(img)

    # Merging the BGR channels with the new alpha channel
    result = cv2.merge([b, g, r, alpha_channel])

    # Saving the resulting image
    # (First line grabs absolute path to this file, second line combines filename and 
    # file path, third line saves the image there)
    project_root = os.path.dirname(os.path.abspath(__file__)) #grabbing current root
    output_path = os.path.join(project_root, 'processed_images', 'output_with_transparent_bg.png')
    cv2.imwrite(output_path, result)

    return output_path

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
        full_prompt = f"I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS, and make sure this is a SIMPLE BLACK LINE DRAWING WITH NO COLOR: {prompt}"
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

        # Removing the white background
        processed_image_path = remove_background(image_url)

        # Returning
        return send_file(processed_image_path, mimetype='image/png')

        #return jsonify(image_path=processed_image_path), 200

        #return jsonify(image_url=image_url), 200

    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
