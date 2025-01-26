import React, { useState } from "react";

const FaceRecognition = () => {
  const [videoFeedVisible, setVideoFeedVisible] = useState(false);

  const startWebcam = async () => {
    try {
      const response = await fetch("/start", { method: "POST" });
      if (response.ok) {
        alert("Webcam started successfully.");
        setVideoFeedVisible(true);
      } else {
        alert("Failed to start the webcam.");
      }
    } catch (error) {
      console.error("Error starting webcam:", error);
      alert("An error occurred while starting the webcam.");
    }
  };

  const stopWebcam = async () => {
    try {
      const response = await fetch("/stop", { method: "POST" });
      if (response.ok) {
        alert("Webcam stopped successfully.");
        setVideoFeedVisible(false);
      } else {
        alert("Failed to stop the webcam.");
      }
    } catch (error) {
      console.error("Error stopping webcam:", error);
      alert("An error occurred while stopping the webcam.");
    }
  };

  const startTraining = async () => {
    try {
      const response = await fetch("/start_training", { method: "POST" });
      if (response.ok) {
        alert("Training started successfully.");
      } else {
        alert("Failed to start training.");
      }
    } catch (error) {
      console.error("Error starting training:", error);
      alert("An error occurred while starting the training.");
    }
  };

  const stopTraining = async () => {
    try {
      const response = await fetch("/stop_training", { method: "POST" });
      if (response.ok) {
        alert("Training stopped successfully.");
      } else {
        alert("Failed to stop training.");
      }
    } catch (error) {
      console.error("Error stopping training:", error);
      alert("An error occurred while stopping the training.");
    }
  };

  const styles = {
    body: {
      fontFamily: "'Poppins', sans-serif",
      height: "100vh",
      margin: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "url('/static/bc.jpg') no-repeat center center",
      backgroundSize: "cover",
      color: "white",
    },
    container: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      background: "rgba(0, 0, 0, 0.5)",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "155px",
      marginTop: "30px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      background: "#4caf50",
      color: "white",
      transition: "background 0.3s",
    },
    buttonHover: {
      background: "#45a049",
    },
    stopButton: {
      background: "#dc3545",
    },
    stopButtonHover: {
      background: "#e74c3c",
    },
    img: {
      marginTop: "20px",
      border: "2px solid white",
      borderRadius: "10px",
      width: "95%",
      maxWidth: "600px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      display: videoFeedVisible ? "block" : "none",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>🌟 Face Recognition Application 🌟</h1>
        <p>
          You Initialize your Name then click the button to start Training<br />
          The ML model trains successfully, then click Start Webcam<br />
          You're Getting results happily 😊 else try the process again
        </p>
        <div>
          <img
            id="videoFeed"
            src="/video_feed"
            alt="Video Feed"
            style={styles.img}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={startWebcam}
            onMouseEnter={(e) =>
              (e.target.style.background = styles.buttonHover.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = styles.button.background)
            }
          >
            Start Webcam
          </button>
          <button
            style={{ ...styles.button, ...styles.stopButton }}
            onClick={stopWebcam}
            onMouseEnter={(e) =>
              (e.target.style.background = styles.stopButtonHover.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = styles.stopButton.background)
            }
          >
            Stop Webcam
          </button>
          <button
            style={styles.button}
            onClick={startTraining}
            onMouseEnter={(e) =>
              (e.target.style.background = styles.buttonHover.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = styles.button.background)
            }
          >
            Start Training
          </button>
          <button
            style={{ ...styles.button, ...styles.stopButton }}
            onClick={stopTraining}
            onMouseEnter={(e) =>
              (e.target.style.background = styles.stopButtonHover.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = styles.stopButton.background)
            }
          >
            Stop Training
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
