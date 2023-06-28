# Financial-Table
Personal project for monthly expenses management with interactive interface. [Nest.js 9 + Angular 15]

ONGOING PROJECT

This project's main aim is to provide an interactive and easy way to manage your daily expenses and plan your months. It's like Excel... but better.

Basically, you create your own categories and groups and register your expenses in them. The app will not only list them for you but also give you real-time analytics with info about all your recent financial behaviors from different points of view with graphs and dashboards.

USAGE:

-To set up the project, from root dir:

```
# to get backend/frontend ready-to-go
cd backend && npm i
cd frontend && npm i

# to run backend/frontend
cd backend && npm run start
cd frontend && npm run start
```

Backend default port is 8000 - can be changed by passing another one in .env - and frontend default port is 4200.

-To populate your db with kickstarter sample data, run SQL queries from SQL folder following its README instructions. Default database used is PostgreSQL - can be changed by editing TypeOrmModule.forRoot() configs in app.module.

