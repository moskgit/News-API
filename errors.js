//psql errors handler
exports.handlePsqlErrors = (err ,req, res, next) => {

    if ( err.code >= '22000' && err.code < '23000' ) {
        res.status(400).send( {msg:`Bad request. Data exception Error ${err.code}`} );
    }else if(err.code === '23503'){
        res.status(404).send({msg: "404 not found - username does not exist in the database."});
    }else if( err.code >= '23000' && err.code <= '23505' || err.code === '23514' || err.code === '23P01' ) {
        res.status(400).send( {msg:`Malfunction: Class 23 — Integrity Constraint Violation: ${err.code}`} );
    }else if( err.code >= '08000' && err.code < '09000' ) { 
        err.status(400).send( {msg: `Can't connect to Database. Connection Exception ${err.code}`} );
    }else if( err.code >= '42*' && err.code < '43*' ) {
        res.status(400).send( {msg:`Bad request. Please check syntax/data of what you're requesting and try again. \nClass 42 — Syntax Error or Access Rule Violation ${err.code}`} );
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

//Server errors handler
exports.handleServerErrors = (err ,req, res, next) => {
    res.status(500).send({msg: "server error occured. Please try again. If the erro persists, please contact the service provider."})
}
    