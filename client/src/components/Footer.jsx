import '../styles/Footer.css';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../assets/RED-in.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Red-In Logo" />
          </div>
          <p className="footer-description">
            Red-In is your trusted destination for premium products. 
            We deliver quality and excellence in every purchase.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#products">Our Products</a></li>
            <li><a href="#deals">Special Deals</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h3 className="footer-title">Customer Service</h3>
          <ul className="footer-links">
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns & Exchanges</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#support">Support Center</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-title">Get In Touch</h3>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Rue 16<br />Taroudant , sidi belkas</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+1 (111) 111-1111</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@red-in.com</span>
            </li>
          </ul>
          
          {/* Newsletter */}
          <div className="newsletter">
            <h4>Subscribe to Newsletter</h4>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2025 Red-In. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}