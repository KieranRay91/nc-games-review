# Installing the relevant software 


Please be sure to run npm install to instal all the relevant packages. Most of what you need is there already, but you will additionally need to install express and supertest.



# Connecting to the Databases

In order to connect to the two databases locally, you will need to create two .env files:
.env.development
.env.test

In the corresponding .env files you will then need to input:
PGDATABASE=<database_name_here>


This will mean that in the .env.development file there should be:
PGDATABASE=nc_games

In the .env.test there should be:
PGDATABASE=nc_games_test
