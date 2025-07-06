const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('<h1>Hello, Octagon! This is Express!</h1>');
});

app.get('/static', (req, res) => {
  res.send({
    header: "Hello",
    body: "Octagon NodeJS Test"
  });
});

app.get('/dynamic', (req, res) => {
  const { a, b, c } = req.query;

  if (
    isNaN(parseFloat(a)) || !isFinite(a) ||
    isNaN(parseFloat(b)) || !isFinite(b) ||
    isNaN(parseFloat(c)) || !isFinite(c)
  ) {
    return res.send({ header: "Error" });
  }
  const numberA = parseFloat(a);
  const numberB = parseFloat(b);
  const numberC = parseFloat(c);
  const result = (numberA * numberB * numberC) / 3;
  res.send({
    header: "Calculated",
    body: result
  });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});