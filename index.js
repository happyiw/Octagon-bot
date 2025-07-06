const express = require("express");
const app = express();
const mySql = require("mysql2");
const port = 3000;

const TelegramBot = require('node-telegram-bot-api');

const token = 'lol_no';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
	
  const chatId = msg.chat.id;
  const resp = match[1]; 

  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Привет, Октагон!!!');
});

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




const connection = mySql.createConnection({
	host: "localhost",
	user: "root",
	database: "chatbottests",
	password: 'admin'
});


app.get('/getAllItems', (req, res) => {
	connection.query("SELECT * FROM items", (error, results) => {
		if (error) {
			res.send(null);
		} else {
			res.send(results); 
		}
	});
});

app.post('/addItem', (req,res)=>{
	const {name, desc} = req.query;
	if (!name || !desc) {
		return res.send(null);
	}

	connection.query("INSERT INTO items(name, `desc`) VALUES(?, ?)", [name, desc], function(err, results) {
		if (err) { 
			return res.send(null);
		}
		res.send({name,desc});
	});
});

app.post('/deleteItem', (req, res) => {
	const { id } = req.query;
	if (isNaN(parseFloat(id)) || !isFinite(id)) {
		return res.send(null); 
	}
	const numberID = Number(id);

	connection.query("DELETE FROM items WHERE id = ?", [numberID], function(err, results) {
		if (err) {
		  return res.send(null); 
		}
		if (results.affectedRows === 0) {
		  return res.send({}); 
		}
		res.send({ id: numberID }); 
	});
});

app.post('/updateItem', (req, res) => {
	const { id, name, desc } = req.query;
	if (isNaN(parseFloat(id)) || !isFinite(id) || !name || !desc) {
		return res.send(null);
	}

	const numberID = Number(id);

	connection.query("UPDATE items SET name = ?, `desc` = ? WHERE id = ?", [name, desc, numberID], function (err, results) {
		if (err) {
			return res.send(null); 
		}
		if (results.affectedRows === 0) {
			return res.send({}); 
		}
		res.send({id: numberID,name,desc});
	});
});




app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});