const express = require('express');
const app = express();
const port = 3000;

// Middleware and routes setup
// ... existing code ...

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});