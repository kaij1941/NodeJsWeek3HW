const dotenv = require('dotenv');
const mongoose =require('mongoose');

//環境設定
dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD)
//資料庫連線
mongoose.connect(DB)
    .then(()=>{
        console.log("資料庫連線成功")
    }).catch((error)=>{
        console.log(error);
    })