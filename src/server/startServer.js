const app = require('./server');
const port = Number(process.env.API_PORT) || 5000;

app.listen(port, () => {
  console.log(`API on http://localhost:${port}`);
});
