// src/components/Footer.tsx
import { Brain } from "lucide-react";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const navigation = {
  product: [
    { name: "Features", href: "https://www.example.com/features" },
    { name: "Pricing", href: "https://www.example.com/pricing" },
    { name: "Integrations", href: "https://www.example.com/integrations" },
    { name: "Changelog", href: "https://www.example.com/changelog" },
  ],
  resources: [
    { name: "Documentation", href: "https://www.example.com/docs" },
    { name: "Tutorials", href: "https://www.example.com/tutorials" },
    { name: "Blog", href: "https://www.example.com/blog" },
    { name: "Support", href: "https://www.example.com/support" },
  ],
  company: [
    { name: "About", href: "https://www.example.com/about" },
    { name: "Careers", href: "https://www.example.com/careers" },
    { name: "Contact", href: "https://www.example.com/contact" },
    { name: "Partners", href: "https://www.example.com/partners" },
  ],
  legal: [
    { name: "Privacy Policy", href: "https://www.example.com/privacy-policy" },
    { name: "Terms of Service", href: "https://www.example.com/terms-of-service" },
    { name: "Cookies Settings", href: "https://www.example.com/cookies-settings" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: <FaFacebookF /> },
  { name: "Twitter", href: "https://twitter.com", icon: <FaTwitter /> },
  { name: "Instagram", href: "https://instagram.com", icon: <FaInstagram /> },
  { name: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedinIn /> },
  { name: "GitHub", href: "https://github.com", icon: <FaGithub /> },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
         <button onClick={() => { window.location.hash = ''; }} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 group-hover:text-gray-950">StallOS</p>
              <p className="text-xs text-gray-500">AI Street Food OS</p>
            </div>
          </button>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-6 text-xl text-gray-600">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-label={link.name}
                className="hover:text-orange-500 transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 col-span-1 sm:col-span-2 md:col-span-3 gap-8"
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StallOS. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            {navigation.legal.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-orange-500 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
