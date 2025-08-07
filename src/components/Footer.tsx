// src/components/Footer.tsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4 text-center">
      <p>© {new Date().getFullYear()} Digi-Vent. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
