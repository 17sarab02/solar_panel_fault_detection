import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import base64
import cv2
from io import BytesIO
from PIL import Image
from flask import Flask, render_template
from flask_socketio import SocketIO
import asyncio
import tensorflow as tf
import numpy as np
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

model = tf.keras.models.load_model('./FinalArchitecture.h5')
model.compile(loss='category_crossentropy', metrics=['accuracy'], optimizer='adam')

moving_average_range = 3
last_n_observations = []

def code_to_image(base64_string):
    base64_string = base64_string.split(",")[-1]
    image_data = base64.b64decode(base64_string)
    image_stream = BytesIO(image_data)
    image = Image.open(image_stream)
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)
    prediction_vector = model(image_array)[0]
    last_n_observations.append(prediction_vector)
    if(len(last_n_observations) > moving_average_range):
        last_n_observations.pop(0)
    return np.mean(last_n_observations, axis=0)

@socketio.on('classifyImage')
def handle_classification(image_data):
    try:
        prediction_vector = code_to_image(image_data)
        prediction_vector = prediction_vector.astype(float)
        prediction_vector = prediction_vector.tolist()
        print(prediction_vector)
        socketio.emit('classificationResult', prediction_vector)
    except Exception as e:
        print(f'Error during classification: {str(e)}')
        socketio.emit('classificationError', {'message': 'Error during classification'})

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, port=5500)