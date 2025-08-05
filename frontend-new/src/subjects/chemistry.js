import React from "react";
import "../styles/chemistry.css";
import { FaBookOpen, FaFlask, FaMicrophone, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Chemistry = () => {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="overlay-box">
        <h1 className="chem-title">Chemistry</h1>
        <p className="chem-subtitle">Learn, Practice, and Test Your Knowledge</p>

        <div className="button-group">
          <button className="action-button">
            <FaBookOpen className="icon" />
            Know about chapter
          </button>

          <button className="secondary-button">
            <FaFlask className="icon" />
            Take Mock test
          </button>

          <button className="action-button">
            <FaMicrophone className="icon" />
            Ask a Question through speech
          </button>

          <button
            className="danger-button"
            onClick={() => navigate("/chemistry-upload-mcq")}
          >
            <FaFileAlt className="icon" />
            Write MCQs from PDF or Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chemistry;
