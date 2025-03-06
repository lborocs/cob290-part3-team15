FRONT_END="/home/ubuntu/repository/frontend"
TARGET_DIR="/var/www/html"


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

echo "Complete!"