// require('dotenv').config();
// const express = require('express');
// const fileRoutes = require('./routes/fileRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json());
// app.use('/api', fileRoutes);

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




require('dotenv').config();
const express = require('express');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', fileRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
