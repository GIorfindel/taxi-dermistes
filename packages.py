import os
os.chdir('taxi-dermistes-server')
os.system('npm install tracer --save')
os.system('npm install express --save')
os.system('npm install body-parser --save')
os.system('npm install validator --save')
os.system('npm install eslint --save-dev')
os.system('npm install eslint-config-usecases --save-dev')
os.system('npm install browserify --save-dev')

os.chdir('../taxi-dermistes-web')
os.system('npm install express-http-proxy --save')
