FROM node:18-alpine

WORKDIR /app

# העתקת קבצי התלויות והתקנתן
COPY package*.json ./
RUN npm install

# העתקת כל הקבצים לפרויקט (קוד השרת, HTML, CSS, JS והתמונה)
COPY . .

# חשיפת הפורט
EXPOSE 3000

# הרצת השרת
CMD ["npm", "start"]
