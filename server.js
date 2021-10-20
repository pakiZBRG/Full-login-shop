const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer');
const app = express();
require('dotenv').config();

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // Windows doesn't accept ":" in filenames
        cb(null, new Date().toISOString().replace(/:/g, '-') + ' - ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === "image/jpeg"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const stream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('dev', {stream}));
app.use(compression());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: diskStorage, fileFilter}).single('myImage'));

// Database Connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

//Routes
app.use("/users", require('./routes/users'));
app.use("/products", require('./routes/products'));
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));