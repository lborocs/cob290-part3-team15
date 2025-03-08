FRONT_END="/home/ubuntu/repository/frontend"
BACK_END="/home/ubuntu/repository/backend"
BACK_END_SERVER="/home/ubuntu/backend"
STATIC_DIR="/home/ubuntu/static-files"
TARGET_DIR="/var/www/html"

echo $IP

#Frontend
cd $FRONT_END
echo "Installing all front end dependencies"
npm install

echo "Building frontend"
npm run build

echo "Clearing target directory"
sudo rm -rf $TARGET_DIR/*

echo "Pushing new build to target directory"
sudo cp -r $FRONT_END/dist/* $TARGET_DIR/

echo "Restarting Apache..."
sudo systemctl restart apache2

#Backend
echo "Ending all existing PM2 Processes"
sudo pm2 stop all
sudo pm2 delete all
sudo pm2 kill
sudo pm2 unstartup

echo "Clearing old Backend"
sudo rm -rf $BACK_END_SERVER/*

echo "Copying Static files to new Backend"
sudo cp -r $STATIC_DIR/* $BACK_END_SERVER

echo "Copying Back end from Repository"
sudo cp -r $BACK_END/* $BACK_END_SERVER

cd $BACK_END_SERVER
echo "Installing all back end dependencies"
sudo npm install

echo "Adding IP to Env File"
echo "IP=$IP" >> .env

echo "Starting the server"
sudo pm2 start server.js
sudo pm2 save

echo "Complete!"


