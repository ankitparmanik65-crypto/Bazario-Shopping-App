import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-emoji">🔍</div>

        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>

        <p className="notfound-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="notfound-actions">
          <button
            className="notfound-btn primary"
            onClick={() => navigate("/")}
          >
            🏠 Go to Homepage
          </button>

          <button
            className="notfound-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;