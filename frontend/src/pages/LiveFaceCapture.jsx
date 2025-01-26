import React, { useState } from "react";

const LiveFaceCapture = () => {
  const [name, setName] = useState("");
  const [captureActive, setCaptureActive] = useState(false);
  const [status, setStatus] = useState("");
  const [notification, setNotification] = useState("");

  const styles = {
    body: {
      fontFamily: "'Poppins', sans-serif",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      background: "url('/static/bc1.jpg') no-repeat center center",
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
    formInput: {
      padding: "10px 15px",
      width: "70%",
      borderRadius: "25px",
      border: "2px solid #fff",
      outline: "none",
      background: "transparent",
      color: "white",
      fontSize: "1rem",
      marginBottom: "15px",
    },
    formButton: {
      display: "block",
      padding: "12px 25px",
      background: "#ff6f61",
      border: "none",
      borderRadius: "25px",
      color: "white",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background 0.3s",
      width: "80%",
      margin: "10px auto",
    },
    formButtonHover: {
      background: "#ff856a",
    },
    controlsButton: {
      padding: "12px 20px",
      background: "#4caf50",
      border: "none",
      borderRadius: "25px",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.3s",
      margin: "5px",
      marginTop: "15px",
    },
    controlsButtonHover: {
      background: "#66bb6a",
    },
    statusText: {
      marginTop: "15px",
      fontSize: "1.1rem",
    },
    notification: {
      marginTop: "10px",
      color: "#ffdf6e",
      fontWeight: "bold",
    },
  };

  const initialize = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(name)}`,
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setCaptureActive(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error initializing:", error);
    }
  };

  const startCapture = async () => {
    try {
      const response = await fetch("/start", { method: "POST" });
      const result = await response.json();
      if (response.ok) {
        setStatus("Capturing...");
        setNotification("");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error starting capture:", error);
    }
  };

  const stopCapture = async () => {
    try {
      const response = await fetch("/stop", { method: "POST" });
      const result = await response.json();
      if (response.ok) {
        setStatus("Capture stopped.");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error stopping capture:", error);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>🌟 Live Face Capture App 🌟</h1>
        <p>Enter your name below to start capturing your beautiful face.</p>
        <form onSubmit={initialize}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={styles.formInput}
          />
          <button
            type="submit"
            style={styles.formButton}
            onMouseEnter={(e) =>
              (e.target.style.background = styles.formButtonHover.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.background = styles.formButton.background)
            }
          >
            Initialize
          </button>
        </form>
        {captureActive && (
          <div>
            <button
              onClick={startCapture}
              style={styles.controlsButton}
              onMouseEnter={(e) =>
                (e.target.style.background = styles.controlsButtonHover.background)
              }
              onMouseLeave={(e) =>
                (e.target.style.background = styles.controlsButton.background)
              }
            >
              Start Capturing
            </button>
            <button
              onClick={stopCapture}
              style={styles.controlsButton}
              onMouseEnter={(e) =>
                (e.target.style.background = styles.controlsButtonHover.background)
              }
              onMouseLeave={(e) =>
                (e.target.style.background = styles.controlsButton.background)
              }
            >
              Stop Capturing
            </button>
            <p style={styles.statusText}>{status}</p>
            <div style={styles.notification}>{notification}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFaceCapture;
