require('dotenv').config(); // This loads environment variables from .env file into process.env
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const serviceAccount = {
  "type": "service_account",
  "project_id": "kampkode-assignment",
  "private_key_id": process.env.KEY_ID,
  "private_key": process.env.PRIVATE_KEY, // Replace '\\n' with actual newlines
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
  "client_x509_cert_url": process.env.CLIENT_CERT_URL,
  "universe_domain": "googleapis.com"
};


const app = express();
app.options("", cors(corsConfig));
app.use(cors());
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const port = process.env.PORT || 3000;
const db = admin.firestore();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/success", (req, res) => {
  res.render("success.ejs");
});

app.post("/submit", (req, res) => {
  try {
    const id = req.body.email;
    const userJson = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
    }
    db.collection("users").doc(id).set(userJson);
    res.redirect("/success");
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
