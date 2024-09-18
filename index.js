


// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// const secretKey = 'Hw8GEdUOZH'; // Consistent secret key for signing and verifying JWT

// // MongoDB Connection
// mongoose.connect('mongodb+srv://duz:duz@duz.jod3n.mongodb.net/duz', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Models
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   isAdmin: { type: Boolean, default: false },
//   blocked: { type: Boolean, default: false },
// });
// const propertySchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   address: String,
//   location: {
//     type: String,
//     enum: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
//   },
//   phone: String,
//   images: [String],
//   videos: [String],
//   uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });
// const User = mongoose.model('User', userSchema);
// const Property = mongoose.model('Property', propertySchema);

// // JWT Middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Multer Configuration for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = './uploads/';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Routes

// // Serve frontend pages
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// app.get('/admin', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin.html'));
// });

// app.get('/register', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'register.html'));
// });

// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// app.get('/admin-login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
// });

// // User Registration
// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   const hashedPassword = await bcryptjs.hash(password, 10);

//   try {
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful' });
//   } catch (error) {
//     res.status(400).json({ error: 'Registration failed', details: error.message });
//   }
// });

// // User Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user || !(await bcryptjs.compare(password, user.password)) || user.blocked) {
//     return res.status(401).json({ message: 'Invalid credentials or account blocked' });
//   }

//   const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secretKey);
//   res.json({ message: 'Login successful', token });
// });

// // Upload Property
// app.post('/properties', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 5 }]), async (req, res) => {
//   const { title, description, address, location, phone } = req.body;
//   const images = req.files['images']?.map(file => file.path);
//   const videos = req.files['videos']?.map(file => file.path);

//   try {
//     const newProperty = new Property({
//       title,
//       description,
//       address,
//       location,
//       phone,
//       images,
//       videos,
//       uploadedBy: req.user.id,
//     });
//     await newProperty.save();
//     res.status(201).json({ message: 'Property uploaded successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Failed to upload property', details: error.message });
//   }
// });

// // Fetch all properties (Home Page)
// app.get('/properties', async (req, res) => {
//   const properties = await Property.find().populate('uploadedBy', 'name email');
//   res.json(properties);
// });

// // User Dashboard: View and Delete Properties
// app.get('/dashboard', authMiddleware, async (req, res) => {
//   try {
//     const properties = await Property.find({ uploadedBy: req.user.id }).exec();
//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching properties', error: error.message });
//   }
// });

// // app.delete('/dashboard/:propertyId', authMiddleware, async (req, res) => {
// //     try {
// //       const property = await Property.findById(req.params.propertyId);
// //       if (!property) return res.status(404).json({ message: 'Property not found' });
  
// //       if (property.uploadedBy.toString() !== req.user.id) {
// //         return res.status(403).json({ message: 'Unauthorized to delete this property' });
// //       }
  
// //       await Property.findByIdAndDelete(req.params.propertyId);
// //       res.json({ message: 'Property deleted' });
// //     } catch (error) {
// //       res.status(500).json({ message: 'Error deleting property', error: error.message });
// //     }
// //   });
  

// app.delete('/dashboard/:propertyId', authMiddleware, async (req, res) => {
//     try {
//       const property = await Property.findById(req.params.propertyId);
//       if (!property) return res.status(404).json({ message: 'Property not found' });
  
//       // Remove the restriction that checks if the user uploaded the property
//       await Property.findByIdAndDelete(req.params.propertyId);
//       res.json({ message: 'Property deleted' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error deleting property', error: error.message });
//     }
//   });
  

// // Admin Dashboard: View Users and Properties
// // app.get('/admin/dashboard', authMiddleware, async (req, res) => {
// //   if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

// //   const users = await User.find();
// //   const properties = await Property.find().populate('uploadedBy', 'name email');
// //   res.json({ users, properties });
// // });

// // Admin Dashboard: View Users and Properties
// app.get('/admin/dashboard', authMiddleware, async (req, res) => {
//     if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
  
//     try {
//       const users = await User.find();
//       const properties = await Property.find().populate('uploadedBy', 'name email');
//       res.json({ users, properties });
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
//     }
//   });
  

// // Admin Block/Unblock User
// app.post('/admin/block/:userId', authMiddleware, async (req, res) => {
//   if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

//   await User.findByIdAndUpdate(req.params.userId, { blocked: true });
//   res.json({ message: 'User blocked' });
// });

// app.post('/admin/unblock/:userId', authMiddleware, async (req, res) => {
//   if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

//   await User.findByIdAndUpdate(req.params.userId, { blocked: false });
//   res.json({ message: 'User unblocked' });
// });

// // Admin Delete Property
// app.delete('/admin/properties/:propertyId', authMiddleware, async (req, res) => {
//   if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

//   await Property.findByIdAndDelete(req.params.propertyId);
//   res.json({ message: 'Property deleted' });
// });

// // Hardcoded Admin Login
// app.post('/admin/login', (req, res) => {
//   const { email, password } = req.body;
//   if (email === 'admin@example.com' && password === 'admin123') {
//     const token = jwt.sign({ id: 'admin', isAdmin: true }, secretKey);
//     return res.json({ message: 'Admin login successful', token });
//   }
//   res.status(401).json({ message: 'Invalid admin credentials' });
// });

// // Start the Server
// app.listen(3000, () => console.log('Server running on port 3000'));



const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

const secretKey = 'Hw8GEdUOZH'; // Consistent secret key for signing and verifying JWT

// MongoDB Connection
mongoose.connect('mongodb+srv://duz:duz@duz.jod3n.mongodb.net/duz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
});
const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  location: {
    type: String,
    enum: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
  },
  phone: String,
  images: [String],
  videos: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const User = mongoose.model('User', userSchema);
const Property = mongoose.model('Property', propertySchema);

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Authenticated user:', user);
    req.user = user;
    next();
  });
};

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// User Registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', details: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcryptjs.compare(password, user.password)) || user.blocked) {
    return res.status(401).json({ message: 'Invalid credentials or account blocked' });
  }

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secretKey);
  res.json({ message: 'Login successful', token });
});

// Upload Property
app.post('/properties', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 5 }]), async (req, res) => {
  const { title, description, address, location, phone } = req.body;
  const images = req.files['images']?.map(file => file.path);
  const videos = req.files['videos']?.map(file => file.path);

  try {
    const newProperty = new Property({
      title,
      description,
      address,
      location,
      phone,
      images,
      videos,
      uploadedBy: req.user.id,
    });
    await newProperty.save();
    res.status(201).json({ message: 'Property uploaded successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to upload property', details: error.message });
  }
});

// Fetch all properties (Home Page)
app.get('/properties', async (req, res) => {
  const properties = await Property.find().populate('uploadedBy', 'name email');
  res.json(properties);
});

// User Dashboard: View and Delete Properties
app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ uploadedBy: req.user.id }).exec();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

app.delete('/dashboard/:propertyId', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Remove the restriction that checks if the user uploaded the property
    await Property.findByIdAndDelete(req.params.propertyId);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

// Admin Login
// Hardcoded Admin Login
app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin', isAdmin: true }, secretKey);
      return res.json({ message: 'Admin login successful', token });
    }
    res.status(401).json({ message: 'Invalid admin credentials' });
  });
  

// Admin Dashboard: View Users and Properties
app.get('/admin/dashboard', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

  try {
    const users = await User.find();
    const properties = await Property.find().populate('uploadedBy', 'name email');
    res.json({ users, properties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

// Admin Block/Unblock User
app.post('/admin/block/:userId', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

  try {
    await User.findByIdAndUpdate(req.params.userId, { blocked: true });
    res.json({ message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error: error.message });
  }
});

app.post('/admin/unblock/:userId', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

  try {
    await User.findByIdAndUpdate(req.params.userId, { blocked: false });
    res.json({ message: 'User unblocked' });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking user', error: error.message });
  }
});

// Admin Delete Property
app.delete('/admin/properties/:propertyId', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });

  try {
    await Property.findByIdAndDelete(req.params.propertyId);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
