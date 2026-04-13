"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#1a1c23] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-3xl font-bold italic tracking-tight font-sans text-[#2874f0]">
                                Paasly
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your one-stop destination for all local services. connecting you with the best shops and professionals in your area.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#2874f0] transition-colors group">
                                <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#E1306C] transition-colors group">
                                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#1DA1F2] transition-colors group">
                                <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#0077b5] transition-colors group">
                                <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-[#2874f0] transition-colors text-sm flex items-center">
                                    <ArrowRight className="w-3 h-3 mr-2" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/explore" className="text-gray-400 hover:text-[#2874f0] transition-colors text-sm flex items-center">
                                    <ArrowRight className="w-3 h-3 mr-2" />
                                    Explore Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-[#2874f0] transition-colors text-sm flex items-center">
                                    <ArrowRight className="w-3 h-3 mr-2" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-[#2874f0] transition-colors text-sm flex items-center">
                                    <ArrowRight className="w-3 h-3 mr-2" />
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-[#2874f0] mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    123 Business Park, Main Street,<br />Borivali West, Mumbai - 400092
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-[#2874f0] mr-3 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-[#2874f0] mr-3 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">support@paasly.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest updates and offers.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#2874f0] text-sm text-gray-300 placeholder-gray-500"
                            />
                            <button className="w-full bg-[#2874f0] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center bg-[#1a1c23]">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Paasly. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
