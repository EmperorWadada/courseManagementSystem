const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const dbConnection = require('./config/connectToDB');
const fileupload = require('express-fileupload');
const bootcampRouter = require('./router/bootcamps');
const errorHandler = require('./middleware/error');
const CoursesRouter = require('./router/courseRoute');


dotenv.config({ path: "./config/config.env" });


const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

dbConnection();
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', CoursesRouter);

app.use(errorHandler);

const server = app.listen(PORT,
    () => console.log(`Server running in: ${process.env.NODE_ENV} mode on port: ${PORT}`)
);

//Unhandled Error, shutdown server

process.on('unhandledRejection', (err, promise) => {

    console.log("Server shutting down!" + err.message);
    server.close(
        process.exit(1)
    );
});