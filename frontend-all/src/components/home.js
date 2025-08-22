
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import "../styles/home.css";
import ActionCard from "./ActionCard";
import { homeConfig } from "../config";

const Home = () => {
  const navigate = useNavigate();
  const handleStartLearning = () => navigate("/upload");

  return (
    <div className="home-container">
      <header className="header">
        <h2 className="brand">{homeConfig.brand}</h2>
        <button className="settings-btn" type="button" aria-label="Settings">
          <FiSettings />
        </button>
      </header>

      <section className="welcome-box">
        <h3 className="greeting">{homeConfig.greeting}</h3>

        <div className="welcome-card">
          <img
            src={homeConfig.welcomeCard.image}
            alt={homeConfig.welcomeCard.alt}
            className="welcome-img"
          />
          <div className="welcome-text">
            <h4 className="subhead">{homeConfig.welcomeCard.subhead}</h4>
            <p className="muted">{homeConfig.welcomeCard.muted}</p>
          </div>
          <button className="start-btn" onClick={handleStartLearning}>
            {homeConfig.welcomeCard.buttonText}
          </button>
        </div>
      </section>

      <section>
        <h3 className="section-title">{homeConfig.workFlow.title}</h3>
        <div className="quick-actions">
          {homeConfig.workFlow.actions.map((action, index) => (
            <ActionCard
              key={index}
              image={action.image}
              title={action.title}
              description={action.description}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-title">{homeConfig.features.title}</h3>
        <div className="features">
          {homeConfig.features.items.map((feature, index) => (
            <div className="feature-card" key={index}>
              <img src={feature.image} alt={feature.alt} />
              <p className="feature-label">{feature.label}</p>
              <p className="feature-muted">{feature.muted}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

