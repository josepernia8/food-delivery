# Instructions to RUN the API

## With Docker

### Initial Configurations
Run `docker-compose up -d`
Enter to the docker container DB `docker exec -it food-delivery-db psql -U postgres -d delivery` (you can also use any client to connect to the DB and import these files).

Then run the `structure.sql` after this one `fixtures.sql`

### Run Tests
`docker exec food-delivery-api mocha test/test-server.js`
  or
`docker exec food-delivery-api ./node_modules/.bin/mocha test/test-server.js`

### Additional Note
If some changes made doesn't reflect run this command `docker restart food-delivery-api`

## Without Docker

### Initial Configurations
#### Database Connection
```
  Go to the file `app/services/index.js` and update this line:
    `const connectionString = process.env.POSTGRES_HOST;`
  with 
    `postgres://postgres:passwd@localhost:5432/delivery`
  or use any host/ports/db you have.
  You can also declare the environment variable with the same value that has in the docker-compose.yml api service.
```

#### Database Fixtures
```
Enter to the DB server console (you can also use any client to connect to the DB and import these files).
Then run the `structure.sql` after this one `fixtures.sql`
```

#### RabbitMQ Connection
```
  We are using this line to open the connection to the rabbitMq container:
    `const amqp = require('amqplib').connect('amqp://rabbit');`
  The connect() method attribute need to be changed to this:
    `amqp://localhost:5672`
```

### Next Steps
Start your Database and your RabbitMQ Server
Run `npm start` in your node environment

### Run Tests
Type `mocha test/test-server.js`

## EndPoint Test With Postman
The main folder has a Postman Collection File to Import `Food Delivery.postman_collection.json` so you can test all the endpoints there.

The Login EndPoint inside `User Managament` directory works for creating the JWT Token needed in all the Restaurant and Orders EndPoints.

Authorization is set to inherit from parent and the Collection has `Authorization Bearer Token {{Token}}` configuration.

The only thing you need to do is, after LogIn use or create your environment on the top right options of postman.

Then and add a new Environment Variable with this structure (for more information check `postman-config.png` in the root directory):

  `{token: value}`