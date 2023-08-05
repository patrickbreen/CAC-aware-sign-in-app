sudo echo "
[Unit]
Description=My Node.js Application
After=network.target

[Service]
User=leet
Group=leet
WorkingDirectory=/home/leet/workspace/CAC-aware-sign-in-app
ExecStart=/home/leet/.nvm/versions/node/v18.17.0/bin/node /home/leet/workspace/CAC-aware-sign-in-app/server.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cac-enabled-signin-app
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/cac-enabled-signin-app.service

sudo chmod 644 /etc/systemd/system/cac-enabled-signin-app.service
sudo systemctl daemon-reload
sudo systemctl enable cac-enabled-signin-app
sudo systemctl start cac-enabled-signin-app

sudo echo "
/var/log/syslog {
    daily
    rotate 7
    compress
    postrotate
        /usr/sbin/service rsyslog reload > /dev/null
    endscript
}
" > /etc/logrotate.d/cac-enabled-signin-app

sudo systemctl status cac-enabled-signin-app
