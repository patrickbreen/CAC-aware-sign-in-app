const https = require('https');
const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 4433;
const admins = ['BREEN.PATRICK.KENMURE.1537066101'];

// Specify the paths to your server certificate and key files
const serverOptions = {
  cert: fs.readFileSync('certs/server.crt'),
  key: fs.readFileSync('certs/server.key'),
  requestCert: true,
  rejectUnauthorized: true,
  ca: [fs.readFileSync('certs/truststore_dod.pem')],
};

// Open a database connection
const db = new sqlite3.Database('signins.db');

// Create a table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS signins (name TEXT, ip TEXT, datetime TEXT)`);

app.get('/', (req, res) => {
  const subject = req.socket.getPeerCertificate().subject.CN;
  const record = { name: subject, ip: req.ip, datetime: new Date().toISOString() };
  console.log(record);

  // Insert the record into the database
  db.run(`INSERT INTO signins (name, ip, datetime) VALUES (?, ?, ?)`, [record.name, record.ip, record.datetime]);

  res.send(`Hello ${record.name}, you are signed in`);
});

app.get('/list', (req, res) => {
  const subject = req.socket.getPeerCertificate().subject.CN;
  if (admins.includes(subject)) {
    // Get the "days" parameter from the query string, or default to 1
    const days = req.query.days ? parseInt(req.query.days, 10) : 1;

    // Check for a valid "days" value
    if (isNaN(days) || days < 0) {
      res.status(400).send('Invalid value for "days"');
      return;
    }

    // Query sign-ins from the specified number of days ago
    const dateAgo = new Date(new Date().setDate(new Date().getDate() - days)).toISOString();
    db.all(`SELECT * FROM signins WHERE datetime > ? ORDER BY datetime ASC`, [dateAgo], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        return;
      }
      const unique_results = rows.filter((value, index, self) => {
        return self.map(item => item.name).indexOf(value.name) === index;
      });
      res.json(unique_results); // Send the list of sign-ins as JSON
    });
  } else {
    res.send('not authorized, you aren\'t on the admin list');
  }
});

const server = https.createServer(serverOptions, app);

server.on('tlsClientError', (err, tlsSocket) => {
  console.log(`TLS client error: ${err.message}`);
});

server.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});