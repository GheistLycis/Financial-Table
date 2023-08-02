# Financial-Table
Personal project for monthly expenses management with interactive interface. [Nest.js 9 + Angular 15]


This project's main aim is to provide an interactive and easy way to manage your daily expenses and plan your months. It's like Excel... but better.

Basically, you create your own categories and groups and register your expenses in them. The app will not only list them for you but also give you real-time analytics with info about all your recent financial behaviors from different points of view with graphs and dashboards.


USAGE:

-> To set up the project, from root dir:
```
# to get backend/frontend ready-to-go
cd backend/frontend && npm i

# to run backend/frontend
cd backend/frontend && npm run start

# backend can also be bootstrapped with:
npm run dev  # to run on Nest's native watch mode
npm run hot  # to run on Webpack's hot reload mode
```

-> Backend's ```.env``` structure is typed by ```@hapi/joi``` and can be checked in ```app.module```'s ```ConfigModule.validationSchema```.

-> Backend's default port is 8000 and Frontend's default port is 4200.

-> DB tables will be automatically created upon Backend's first init. New users will have kickstarter data created automatically upon signup. To populate your DB with more sample data simply run the queries in the ```populate_db``` SQL file.
