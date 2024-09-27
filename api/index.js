const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const multer = require('multer');
//const cookieParser = require('cookie-parser');
//app.use(express.json())
//app.use(cookieParser());
// app.use(cors({
//   credentials: true,
//   origin: 'https://scrib-eight.vercel.app',
// }));

app.use(express.json());
app.use(cors({
  origin: 'https://scrib-eight.vercel.app', // Allow your frontend URL
  optionsSuccessStatus: 200, // For legacy browsers
}))




// const storage = multer.memoryStorage(); // Use memory storage instead of disk storage
// const upload = multer({ storage: storage });

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file types
  },
});

const upload = multer({ storage: storage });



const fs = require('fs');
const port = 3000;

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';





mongoose.connect(process.env.MONGODB_CONNECTION_URI)
.then(()=>{
  console.log('Connected to MongoDB');
})

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.status(200).json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// app.post('/login', async (req,res) => {
//   const {username,password} = req.body;
//   const userDoc = await User.findOne({username});
//   // compares password provided by user to the 
//   // password stored in the database
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     // when user is logged in we generate a token for the user
//     jwt.sign({username, id:userDoc._id} , secret, {}, (err,token) => {
//       if (err) throw err;
//       // ELSE
//       res.cookie('token', token,{ httpOnly: true, secure: false,  sameSite: 'None' }).json({
//         id:userDoc._id,
//         username,
//       });
//     });
    
    
//   } else {
//     res.status(400).json('wrong credentials');
//   }
// });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.json({
        id: userDoc._id,
        username,
        token, // Return the token in the response
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach user information to the request object
    next();
  });
}

// Example of using the middleware in a protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json(req.user);
});


// app.get('/profile', (req,res) => {
//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

app.post('/logout', (req,res) => {
  res.json('ok');
});




app.post('/post', authenticateToken, upload.single('file'), async (req, res) => {
  const { title, summary, content } = req.body;
  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: req.file.path,
    author: req.user.id, // Use req.user to get the user info
  });
  res.json(postDoc);
});

app.put('/post', authenticateToken, upload.single('file'), async (req, res) => {
  const { id, title, summary, content } = req.body;
  const postDoc = await Post.findById(id);
  const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
  if (!isAuthor) {
    return res.status(400).json('You are not the author');
  }

  const updatedData = { title, summary, content };
  if (req.file) {
    updatedData.cover = req.file.path; // Update cover with Cloudinary path
  }

  await postDoc.update(updatedData);
  res.json(postDoc);
});




// app.post('/post', upload.single('file'), async (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { title, summary, content } = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover: req.file.path, // Use the path returned by Cloudinary
//       author: info.id,
//     });
//     res.json(postDoc);
//   });
// });

// app.put('/post', upload.single('file'), async (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { id, title, summary, content } = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     if (!isAuthor) {
//       return res.status(400).json('You are not the author');
//     }

//     const updatedData = {
//       title,
//       summary,
//       content,
//     };

//     if (req.file) {
//       updatedData.cover = req.file.path; // Update cover with Cloudinary path
//     }

//     await postDoc.update(updatedData);
//     res.json(postDoc);
//   });
// });











// ENDPOINT FOR GETTING ALL THE POSTS FROM THE DATABASE
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      // this sorts the post from the recent to latest
      .sort({createdAt: -1})
      .limit(20)
  );
});


// endpoint for finding blog post by ID
app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(port,() =>{
  console.log(`server running ${port}`)
});
//