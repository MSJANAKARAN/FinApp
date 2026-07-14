require("dotenv").config();

const { app, server } = require("./app");
//ORM for Node.js
const sequelize = require("./config/database");
const logger = require("./config/logger");

const PORT = process.env.PORT || 8004;

async function startServer() {
    try {
        await sequelize.authenticate();

        logger.info("Database Connected.");

        //Equivalent to spring.jpa.hibernate.ddl-auto=update, 
        // it will create database table if not already exist
        await sequelize.sync();

        app.listen(PORT, () => {
            logger.info(`Splitwise Service runnning on port ${PORT}`);
        });

        // server.listen(PORT, () => {
        //     logger.info(`Splitwise Service runnning on port ${PORT}`);
        // });
    } catch (error) {
        logger.error("Unable to start server", error);
    }
}

startServer();