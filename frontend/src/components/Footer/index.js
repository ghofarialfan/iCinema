import React from "react";
import "./style.css";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-brand-section">
          <div className="footer-brand">
            <span className="footer-brand-icon">
              <i className="fas fa-film"></i>
            </span>
            <div>
              <h4>iCinema</h4>
              <p>Web Application</p>
            </div>
          </div>

          <p className="footer-description">
            iCinema is a MERN-based cinema web application designed to provide
            a cleaner movie browsing experience with authentication, movie
            management, and cloud-based deployment support.
          </p>
        </div>

        <div className="footer-info-section">
          <div className="footer-info-card">
            <span>Project</span>
            <strong>CI/CD Deployment</strong>
          </div>

          <div className="footer-info-card">
            <span>Team</span>
            <strong>Kelompok 11</strong>
          </div>

          <div className="footer-info-card">
            <span>Stack</span>
            <strong>MERN + Azure</strong>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 iCinema Web Application — Built by Kelompok 11 for DevOps
          Deployment Project.
        </p>
      </div>
    </footer>
  );
}