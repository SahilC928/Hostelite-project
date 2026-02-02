import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Hostelite</h3>
          <p>Smart hostel management for modern education</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Security</a>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Documentation</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Hostelite Management System</p>
        <div className="footer-social">
          <span>📧</span>
          <span>💬</span>
          <span>📱</span>
        </div>
      </div>
    </footer>
  );
}
