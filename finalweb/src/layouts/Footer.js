import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="py-4 bg-light mt-auto">
      <div className="container-fluid px-4">
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between small">
          <div className="text-muted">
            Copyright &copy; Your Website {currentYear}
          </div>
          <div className="mt-2 mt-sm-0">
            <Link to="/privacy-policy" className="text-decoration-none mx-2">
              Privacy Policy
            </Link>
            &middot;
            <Link to="/terms" className="text-decoration-none mx-2">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
