Background
As part of my coding adventure as a Northcoders student, I have created an API for programmatically retrieving application data. The purpose is to replicate the development of a real-world backend service which I hope will eventually provide this information to the front end architecture.

This server can be used to obtain reviews, comments, users, and categories, as well as methods for adding, deleting, and updating information about them in various ways.

Hosting
Link to hosted version - https://games-reviews-and-discussions.onrender.com/

Cloning the repo

In order to clone the repo you will firstly need to fork it to your github. You can then copy the clone link in the forked repo, type git clone in your terminal and then paste the clone link in like this:

git clone <clone link from forked repo>
Installing dependencies

In the making of this project the following dependencies were used:

Express.js
pg
pg-format
Jest
jest-sorted
Supertest
dotenv
Simply run the following command in your terminal to ensure the necessary dependencies are added:

npm i
Setting environment variables

In order to connect to the two databases locally, you will need to create two .env files: .env.development .env.test. In the corresponding .env files you will then need to input: PGDATABASE=<database_name_here>
This will mean that in the .env.development file there should be: PGDATABASE=nc_games
In the .env.test there should be: PGDATABASE=nc_games_test

Creating and seeding local databases

In order to create and seed the above mentioned databases with information you will merely need to run the following commands in your terminal:

npm run setup-dbs
npm run seed


This project was constructed using TDD (Test Driven Development). If you so wish you can run these same tests yourself by running the following in your terminal:

npm test
Postgres and Node.js

As mentioned above these dependencies are the backbone of this project. The minimum versions required to run this application are V12 and V17 respectively. You can check which versions you are using with the below commands:

node -v
psql --version
