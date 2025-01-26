from flask import Flask, render_template, Response, jsonify, request, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import os
import threading
import logging

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication with React frontend

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

# Constants
HAAR_FILE = "haarcascade_frontalface_default.xml"
DATASET = "dataset"
CONFIDENCE_THRESHOLD = 80
WIDTH, HEIGHT = 130, 100

# Global variables
face_cascade = cv2.CascadeClassifier(HAAR_FILE)
model = cv2.face.LBPHFaceRecognizer_create()
webcam = None
names = {}
images, labels = [], []
capture_active = False
training_active = False
sub_data = None
path = None
count = 0


# --- Load Training Data ---
def load_training_data():
    global names, images, labels
    for (subdirs, dirs, files) in os.walk(DATASET):
        for subdir in dirs:
            id = len(names)
            names[id] = subdir
            subdir_path = os.path.join(DATASET, subdir)
            for filename in os.listdir(subdir_path):
                file_path = os.path.join(subdir_path, filename)
                image = cv2.imread(file_path, 0)
                if image is not None:
                    images.append(image)
                    labels.append(id)
    if images:
        model.train(np.array(images), np.array(labels))
        logging.info("Model trained successfully.")
    else:
        logging.warning("No training data available.")


# --- Training Function ---
def train_model():
    global training_active
    training_active = True
    logging.info("Starting training...")
    try:
        load_training_data()
        logging.info("Training completed.")
    except Exception as e:
        logging.error(f"Training failed: {e}")
    finally:
        training_active = False


# --- Webcam Initialization ---
def initialize_webcam():
    global webcam
    if webcam is None or not webcam.isOpened():
        webcam = cv2.VideoCapture(0)
        logging.info("Webcam initialized.")


# --- Routes ---
@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})


@app.route("/initialize", methods=["POST"])
def initialize_dataset():
    global sub_data, path, count
    sub_data = request.form.get("name", "").strip()
    if not sub_data:
        return jsonify({"error": "Name cannot be empty"}), 400
    path = os.path.join(DATASET, sub_data)
    os.makedirs(path, exist_ok=True)
    count = 0
    return jsonify({"message": f"Dataset initialized for {sub_data}"}), 200


@app.route("/start", methods=["POST"])
def start_capture():
    global capture_active, count, path
    if not sub_data:
        return jsonify({"error": "User name not initialized"}), 400
    initialize_webcam()
    if not webcam.isOpened():
        return jsonify({"error": "Webcam not accessible"}), 500
    capture_active = True
    count = 0
    threading.Thread(target=process_frames).start()
    return jsonify({"message": "Capture started"}), 200


@app.route("/stop", methods=["POST"])
def stop_capture():
    global capture_active, webcam
    capture_active = False
    if webcam and webcam.isOpened():
        webcam.release()
        cv2.destroyAllWindows()
    return jsonify({"message": "Capture stopped"}), 200


@app.route("/start_training", methods=["POST"])
def start_training():
    global training_active
    if training_active:
        return jsonify({"error": "Training is already in progress"}), 400
    threading.Thread(target=train_model).start()
    return jsonify({"message": "Training started"}), 200


@app.route("/stop_training", methods=["POST"])
def stop_training():
    global training_active
    if training_active:
        training_active = False
        return jsonify({"message": "Training stopped"}), 200
    return jsonify({"error": "No training in progress"}), 400


@app.route("/status")
def capture_status():
    if count >= 50:
        return jsonify({"status": "limit_reached"}), 200
    return jsonify({"status": "capturing", "count": count}), 200


@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")


# --- Helper Functions ---
def process_frames():
    global count, capture_active, path
    while capture_active and count < 50:
        ret, frame = webcam.read()
        if not ret:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            face = gray[y : y + h, x : x + w]
            resized_face = cv2.resize(face, (WIDTH, HEIGHT))
            cv2.imwrite(f"{path}/{count + 1}.png", resized_face)
            count += 1
        if count >= 50:
            capture_active = False
            break


def generate_frames():
    global webcam
    initialize_webcam()
    while webcam.isOpened():
        ret, frame = webcam.read()
        if not ret:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            face = gray[y : y + h, x : x + w]
            face_resize = cv2.resize(face, (WIDTH, HEIGHT))
            prediction, confidence = model.predict(face_resize)
            if confidence < CONFIDENCE_THRESHOLD:
                name = names.get(prediction, "Unknown")
                color = (0, 255, 0)
            else:
                name = "Unknown"
                color = (0, 0, 255)
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(
                frame, name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2
            )
        _, buffer = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )


# Run the app
if __name__ == "__main__":
    app.run(debug=True,  port=5000)
