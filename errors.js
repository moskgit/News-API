//psql errors handler
exports.handlePsqlErrors = (err ,req, res, next) => {
    if (err.code){
        res.status(400).send({msg:"Bad request. Please check what you're requesting and try again."})
    }
    else next(err);
}
    
//Custom errors handler
exports.handleCustomErrors = (err ,req, res, next) => {
    if (err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else next(err);
}

//Server error handler
exports.handleServerErrors = (err ,req, res, next) => {
    res.status(500).send({msg: "server error occured. Please try again. If the erro persist, please contact the service provider."})
}
    