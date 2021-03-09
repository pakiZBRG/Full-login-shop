const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: diskStorage, fileFilter}).single('myImage'));

// Database Connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/public'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
    });
}

//Routes
app.use("/users", require('./routes/users'));
app.use("/products", require('./routes/products'));
app.get('/', (req, res) => {
    res.send("Server running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));