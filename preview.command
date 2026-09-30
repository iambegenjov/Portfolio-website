#!/bin/bash
# Double-click to preview the site on this Mac: starts a small local web server and opens it.
# (The site loads its projects from the projects/ folder, which browsers only allow through a server.)
# Close this Terminal window to stop it.
cd "$(dirname "$0")" || exit 1
PORT=8000
(sleep 1; open "http://localhost:$PORT/") &
echo "Previewing at http://localhost:$PORT  (close this window to stop)"
ruby -run -e httpd . -p $PORT
