### To sign in, insert your CAC card, and go to

`https://{SERVER_NAME_OR_IP}:{PORT}/`

You must accept the self signed cert in your browser.

### To view sign ins for the past N days

Insert your CAC card, and go to `https://{SERVER_URL}:{PORT}/list?days={N}`.

If ommited, days defaults to 1, so you can do this for the list of the most recent day. `https://{SERVER_URL}:{PORT}/list`

The Common Name of the user making the request must be in the `const admins = []` list.

### Install app:

`npm install`

### Run app:

`npm run server`

### Generate server self signed certs, valid for 5 years:

I don't include the `certs/server.key` or `certs/server.crt` in this code repo because technically they should be kept secret. If someone knew them they may be able to impersonate your server. Use your own server certs to be safe.

`openssl req -new -newkey rsa:2048 -days 1825 -nodes -x509 -keyout certs/server.key -out certs/server.crt`
