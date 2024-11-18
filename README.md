# AI Coloring Book

## Overview
This project is a simple AI-powered coloring book web application. This version of the project currently includes a basic working functionality where users can generate images using an AI model and then color them directly in the browser.

I used a Flask server as the backend to handle API requests from the frontend and communicate with the OpenAI API for generating line drawings based on user input prompts. The frontend, built using HTML, CSS, and JavaScript, allows users to interact with the AI-generated images by loading and drawing on them directly in the browser. I also integrated real-time image processing with OpenCV to remove the background of generated images.

## DEMONSTRATION


https://github.com/user-attachments/assets/86a954dc-2b40-4b31-9fe6-a967676fd228


https://github.com/user-attachments/assets/d1e31fba-b677-4f0d-af27-3af4d863432e


## Current Features
- **Image Generation**: Users can input a prompt, and the backend will communicate with OpenAI's DALL-E 3 to generate a line drawing based on the prompt. The image is then processed to remove the white background and loaded onto the canvas.
- **Drawing Tools**: Adjustable brush sizes and colors.
- **Undo Functionality**: Users can undo their last drawing action.
- **Image Download**: Download completed image as a PNG file.

## Setup Instructions
### Frontend
1. Clone the repository and navigate to the `frontend` directory.
2. Open `index.html` in a web browser to load the frontend.

### Backend
1. Navigate to the `backend` directory.
2. I used and recommend Python 3.8.17 because I was having issues with other versions.
3. Set up a virtual environment:
python3 -m venv venv source venv/bin/activate

4. Install the required dependencies:
pip install -r requirements.txt

5. Create a `.env` file in the `backend` directory and add your OpenAI API key:
OPENAI_API_KEY=your-api-key-goes-here

6. Run the backend server:
python3 app.py


## Planned Features and Improvements
- **Background Removal**: I will try to further clean up the background removal result.
- **Frontend Improvements**: The frontend will be made more attractive and user-friendly.
- **Website Hosting**: Considering hosting on a website, with users still needing to host the backend locally.
- **Example Images and Demo Video**: Since AI image generation through the API (and any API) always costs money, I plan to provide example images and a demo video to showcase the functionality.

## Issues
- **Background Removal**: The current background removal process works, but the results might be improved with further tweaking.
- **API Costs**: Generating images via the OpenAI API will always cost, users will either have to use their own OpenAI credits or use the example generations.

## Future Plan
A goal I had for this project was to eventually train my own AI model specifically tailored for generating line drawings. This is difficult with time and money constraints from work and school commitments. I am very interested in training my own model, and I have done lots of research into it. Perhaps a different project, a different time.


