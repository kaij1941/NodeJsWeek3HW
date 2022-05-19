
const successResponse =(res,httpCode,result)=>{
    res.status(httpCode).json(
       {
           "status":"success",
           "data":result
       } 
    )
}

module.exports = successResponse;