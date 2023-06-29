# Financial-Table
Personal project for monthly expenses management with interactive interface. [Nest.js 9 + Angular 15]


--- ONGOING PROJECT - STILL UNDER DEVELOPMENT ---


This project's main aim is to provide an interactive and easy way to manage your daily expenses and plan your months. It's like Excel... but better.

Basically, you create your own categories and groups and register your expenses in them. The app will not only list them for you but also give you real-time analytics with info about all your recent financial behaviors from different points of view with graphs and dashboards.


USAGE:

-> ```.env``` structure is typed by ```@hapi/joi``` and can be checked in ```app.module```'s ```ConfigModule.validationSchema```.

-> To set up the project, from root dir:
```
# to get backend/frontend ready-to-go
cd backend && npm i
cd frontend && npm i

# to run backend/frontend
cd backend && npm run start
cd frontend && npm run start
```

-> In backend, you can also use either ```npm run dev``` to run on Nest native watch mode or ```npm run hot``` to run on Webpack hot reload mode.

-> Backend default port is 8000 - can be changed by passing another one in ```.env``` - and frontend default port is 4200.

-> DB tables will be automatically created upon backend first init. To populate your DB with kickstarter sample data simply run, in order, the queries in ```populate_db.sql``` file.
