const errorHandler = (err,req,res,next)=>{
    console.log(err.stack);
    const statusCode = err.statusCode || 500;
    res.send(statusCode).json({
        success: statusCode === 200,
        message: err.message || 'Something went wrong',
    })
}
module.exports = errorHandler;