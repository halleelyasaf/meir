# Use a lightweight Nginx image based on Alpine Linux
FROM nginx:alpine

# Copy all project files (index.html, styles.css, script.js, images) to Nginx static HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
