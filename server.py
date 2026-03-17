#!/usr/bin/env python3
"""
Simple HTTP Server for the Scientific Calculator Webapp
Run: python server.py
Then open http://localhost:8000 in your browser
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000
CURRENT_DIR = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Redirect root to index.html
        if self.path == '/':
            self.path = '/templates/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

if __name__ == '__main__':
    os.chdir(CURRENT_DIR)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✓ Server running at http://localhost:{PORT}")
        print(f"✓ Press Ctrl+C to stop the server")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ Server stopped")
