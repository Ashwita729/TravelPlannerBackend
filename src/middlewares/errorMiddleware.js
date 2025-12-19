HEAD
const notFound = (req, res, next) => {
const error = new Error(`Not Found - ${req.originalUrl}`);
res.status(404);
next(error);
};


const errorHandler = (err, req, res, next) => {
const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
res.status(statusCode).json({
message: err.message,
stack: process.env.NODE_ENV === 'production' ? null : err.stack,
});
};



const notFound = (req, res, next) => {
const error = new Error(`Not Found - ${req.originalUrl}`);
res.status(404);
next(error);
};


const errorHandler = (err, req, res, next) => {
const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
res.status(statusCode).json({
message: err.message,
stack: process.env.NODE_ENV === 'production' ? null : err.stack,
});
};


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = { notFound, errorHandler };