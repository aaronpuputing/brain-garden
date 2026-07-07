#!/usr/bin/env python3
"""Brain Garden 本地预览服务器"""
import http.server
import socketserver

PORT = 3000
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]} {args[1]} {args[2]}")

if __name__ == "__main__":
    print(f"🌱 Brain Garden 预览服务器")
    print(f"📂 提供目录: {DIRECTORY}/")
    print(f"🌐 打开 http://localhost:{PORT}/")
    print(f"按 Ctrl+C 停止")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
