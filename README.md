# SUPPORT Wheel of Fate App

## How to start
### In order to start locally

- Go to 'backend' folder and run
```
    $ npm install
    $ npm start
```

- Go to 'frontend' folder and run
```
    $ npm install
    $ npm start
```

### To cleanup the database and add new data and users, go to __dev_resources and run
```
    $ npm install
    $ node ./scripts/populate-db.js
```

### If you want to start frontend and backend using the docker-compose.yml file inside __dev_resources, you will need to run
```
    docker-compose up -d
```