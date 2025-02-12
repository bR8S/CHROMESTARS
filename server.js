if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const router = express.Router()
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const raceRouter = require('./routes/race')
const racerRouter = require('./routes/racer')
const trackRouter = require('./routes/track')
const historyRouter = require('./routes/history')
const passwordRouter = require('./routes/password')

const User = require('./models/user')

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto')
const path = require('path');

const mongoose = require('mongoose')
const mongoURI = process.env.DATABASE_URL
mongoose.connect(mongoURI)

let conn = mongoose.connection

let gfs, gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// Set up GridFS storage engine for Multer
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads', // The GridFS bucket name
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(methodOverride('_method'))

app.use('/', indexRouter)
app.use('/account', userRouter)
app.use('/race', raceRouter)
app.use('/racer', racerRouter)
app.use('/track', trackRouter)
app.use('/history', historyRouter)
app.use('/password', passwordRouter)

app.use(favicon('public/chromestars-star.png'));

// Upload route
app.post('/upload', upload.single('image'), (req, res) => { 
    if(req.file.filename){
        res.send(JSON.stringify(req.file.filename))
    }
});
  
// Retrieve image by filename
app.get('/file/:filename', async (req, res) => {
    const paramFilename = req.params.filename
    const files = await gfs.files.find({}).toArray()
    const file = files.find(file => file.filename.toString() === paramFilename.toString())

    const readStream = gridfsBucket.openDownloadStream(file._id)
    readStream.pipe(res)
});

app.get('/login', async (req, res) => {
    res.render('login.ejs')
})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
    
        const users = await User.find({})
        const user = users.find( user => user.email.toString() === email.toString())
        const userMatch = await bcrypt.compare(password, user.password)
        
        if(userMatch){
            req.session.user = { id: user._id, username: user.username }
            //res.redirect('/')
            res.status(200).json({ message: 'User login successful.' })
        } else {
            res.status(400).json({ message: 'User password was incorrect.' })
        }
    }
    catch(error) {
        res.status(400).json({ error: 'Something went wrong on the server' })
    }
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            /*id: Date.now().toString(),*/
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone,
            email: req.body.email,
            password: hashedPassword,
            profile_image: 'http://localhost:3000/file/7cde0af6af0f18c6a1545c6d0168a1e4.jpg',
            background_image: 'http://localhost:3000/file/6a886bc8e5def087acbf93b6516eb5a2.png',
            username: req.body.username, 
            bio: 'placeholder bio',
            wins: 0,
            losses: 0,
            competitions: 0,
            score: 0,
            elo: 1000,
            placements: [],
            streak: 0,
            podium_count: 0,
            rivals: [],
            admin: false,
            resetPasswordToken: undefined, 
            resetPasswordExpires: undefined
        })

        await user.save()

        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Logout failed');
        res.redirect('/login')
    });
})

app.listen(process.env.PORT || 3000)