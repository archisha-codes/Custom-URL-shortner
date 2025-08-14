# Custom URL Shortener
A simple Node.js + Express + MongoDB application to shorten URLs and track analytics for each shortened link.

## ✨ Features
* Shorten any URL into an 8-character ID
* Support for predefined short names (e.g., `linkedin`, `google`)
* Redirect users to the original link
* Track the number of clicks and visit history for each short link
* API endpoints for creating short links and retrieving analytics

## 📂 Project Structure
/models        → Mongoose models for MongoDB
/routes        → Express route handlers
/connect.js    → MongoDB connection logic
/index.js      → App entry point

## ⚙️ Requirements
* **Node.js** v18+
* **MongoDB** (local or cloud — e.g., MongoDB Compass / Atlas)
* npm

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/archisha-codes/Custom-URL-shortner.git
cd Custom-URL-shortner

# Install dependencies
npm install
```

## 🔌 Setup MongoDB Connection

1. Start MongoDB locally, or use mongodb compass (https://www.mongodb.com/compass).
2. In `connect.js`, set your MongoDB connection string:

```js
mongoose.connect("mongodb://localhost:27017/urlshortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```
## 🚀 Running the Project

```bash
npm start
```

Server will start at:
```
http://localhost:8001
```

## 📌 API Endpoints
### **Create Short URL**

**POST** (http://localhost:8001/url)
**Body**:
```json
{
  "redirectURL": "https://www.linkedin.com"
}
```

**Response**:
<img width="1222" height="831" alt="Screenshot 2025-08-14 130210" src="https://github.com/user-attachments/assets/dce0bee3-dca9-42ca-aa32-450d66e5ac33" />

### **Redirect to Original**

**GET** `/:shortId`
Opens the original URL in the browser.

### **Get Analytics**

**GET** `/analytics/:shortId`
Returns click count and visit history:
<img width="852" height="684" alt="Screenshot 2025-08-14 132135" src="https://github.com/user-attachments/assets/eb82835c-91f1-41f4-819b-4ca633c61ebb" />

## 🛠 Tech Stack

* **Node.js** + **Express.js** — Backend framework
* **MongoDB** + **Mongoose** — Database & ODM
* **nanoid** — Unique short ID generator

## 📜 License

MIT License © 2025 Archisha Ranjan
