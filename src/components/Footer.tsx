import React from 'react';
import { Github, Twitter, Linkedin, Facebook, Mail } from 'lucide-react';

/**
 * Global Footer Component
 * - Responsive, accessible, and Tailwind-styled
 * - Includes copyright text, social links, and important page links
 * - Designed to sit at the bottom of all pages when placed after main content in a flex column layout
 */
const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-orange-200 bg-gradient-to-r from-orange-50 via-rose-50 to-red-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        {/* Top */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">StallOS</h3>
            <p className="mt-2 text-[11px] text-gray-600">
              AI Street Food OS to optimize menus, pricing, and daily operations.
            </p>
            {/* Social icons restored with non-clickable hash links */}
            <div className="mt-2 flex items-center gap-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="GitHub"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 text-orange-700 hover:text-orange-800 hover:bg-orange-100 transition-colors"
              >
                <Github className="h-3 w-3" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 text-orange-700 hover:text-orange-800 hover:bg-orange-100 transition-colors"
              >
                <Twitter className="h-3 w-3" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 text-orange-700 hover:text-orange-800 hover:bg-orange-100 transition-colors"
              >
                <Linkedin className="h-3 w-3" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 text-orange-700 hover:text-orange-800 hover:bg-orange-100 transition-colors"
              >
                <Facebook className="h-3 w-3" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Email"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 text-orange-700 hover:text-orange-800 hover:bg-orange-100 transition-colors"
              >
                <Mail className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Important links" className="grid grid-cols-2 gap-3 md:col-span-2 md:grid-cols-3">
            <div>
              <h4 className="text-[11px] font-semibold text-orange-700">Company</h4>
              <ul className="mt-2.5 space-y-1 text-[11px] text-gray-700">
                <li>
                  <a
                    href="https://github.com/DarshanBhamare/StallOs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@stallos.app"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-orange-700">Legal</h4>
              <ul className="mt-2.5 space-y-1 text-[11px] text-gray-700">
                <li>
                  <a
                    href="https://www.termsfeed.com/public/uploads/2021/03/sample-terms-of-service-template.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.privacypolicies.com/live/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-orange-700">Resources</h4>
              <ul className="mt-2.5 space-y-1 text-[11px] text-gray-700">
                <li>
                  <a
                    href="https://github.com/DarshanBhamare/StallOs/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/DarshanBhamare/StallOs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-800 hover:underline underline-offset-4"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex flex-col gap-2 border-t border-orange-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-orange-800">© {year} StallOS. All rights reserved.</p>
          <p className="text-[11px] text-orange-700">
            Built with <span className="font-medium text-gray-700">React</span> and <span className="font-medium text-gray-700">Tailwind CSS</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
