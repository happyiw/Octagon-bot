const express = require("express");
const app = express();
const mySql = require("mysql2");
const port = 3000;

const TelegramBot = require('node-telegram-bot-api');

const token = '7835383514:AAG8C1XTlpe41yF104vBUb31mvH0M1GkuZs';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
	
  const chatId = msg.chat.id;
  const resp = match[1]; 

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Привет, Октагон!!!');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Команды:
/site - отправляет в чат ссылку на сайт октагона
/creator - отправляет в чат ФИО автора бота
/randomItem - выбирает случайный предмет
/getItemByID - поиск предмета по значению id
/deleteItem - удаление предмета`);
});

bot.onText(/\/site/, msg => {
	const chatId = msg.chat.id;
    bot.sendMessage(chatId, `сайт Октагона: https://octagon.su`);
});

bot.onText(/\/creator/, msg => {
	const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Создатель бота: Кузьмичев Михаил`);
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






bot.onText(/\/randomItem/, (msg) => {
	const chatId = msg.chat.id;
	connection.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1', (err, results) => {
		if (err || results.length === 0) {
			bot.sendMessage(chatId, 'Ошибка при получении случайного предмета (Его нет)');
		} else {
			const item = results[0];
			bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
		}
	  }
	);
});

bot.onText(/\/getItemByID (\d+)/, (msg, match) => {
	const chatId = msg.chat.id;
	const itemId = match[1];
	connection.query('SELECT * FROM Items WHERE id = ?',[itemId],(err, results) => {
		if (err || results.length === 0) {
			bot.sendMessage(chatId, 'Предмет не найден.');
		} else {
			const item = results[0];
			bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
		}
	  }
	);
});

bot.onText(/\/deleteItem(?:\s+(\d+))?/, (msg, match) => {
	const chatId = msg.chat.id;
	const itemId = match[1];

	if (!itemId) {
		return bot.sendMessage(chatId, 'Ошибка: укажите правильный ID. Пример: /deleteItem 5');
	}

	connection.query('DELETE FROM Items WHERE id = ?', [itemId], (err, result) => {
	if (err) {
		return bot.sendMessage(chatId, 'Ошибка при удалении.');
	}
	if (result.affectedRows === 0) {
		return bot.sendMessage(chatId, 'Ошибка: такого предмета нет.');
	}
	bot.sendMessage(chatId, `Предмет с ID ${itemId} удалён.`);
	});
});









app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});