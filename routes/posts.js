const express =require('express');
const router = express.Router();
const postModel =require('../models/postModel');
const successHandle=require('../service/successResponse');
const httpStatus=require('../util/httpStatus');

router.get('/',async function(req,res){
    try {
        const postsData = await postModel.find();  
        successHandle(res,httpStatus.OK,postsData);
    } catch (error) {
        return appError(httpStatus.BAD_REQUEST, "讀取資料錯誤", next);
    } 
})

router.post('/',async(req,res)=>{
    req.on('end', async()=>{
        try {
            const data =JSON.parse(body);
            if (!data.articleContent) {
                return appError(httpStatus.BAD_REQUEST, "文章內容為必填", next);
            }

            if(!data.userName){
                return appError(httpStatus.BAD_REQUEST, "發文者為必填", next);
            }

            const newArticle= await postModel.create({
                "articleContent":data.articleContent,
                "articlePhoto":data.articlePhoto,
                "userName":data.userName,
                "userPhoto":data.userPhoto,
                "likes":data.likes
            });

            successHandle(res,httpStatus.OK,newArticle);
        } catch (error) {
            return appError(httpStatus.BAD_REQUEST, "新增貼文錯誤", next);
        }
    });     
})

router.patch('/',async(req,res)=>{
    req.on('end', async()=>{
        try {
            const data =JSON.parse(body);

            const id = req.url.split('/').pop();
            const postCheckResult = await postModel.findById(id)

            if (!postCheckResult) {
                return appError(httpStatus.BAD_REQUEST, "找不到此貼文", next);
            } 

            if (!data) {
                return appError(httpStatus.BAD_REQUEST, "請傳遞修改內容", next);
            }

            const newArticle= await postModel.findByIdAndUpdate(
                id,
            {
                "articleContent":data.articleContent,
                "articlePhoto":data.articlePhoto,
                "userName":data.userName,
                "userPhoto":data.userPhoto,
                "likes":data.likes
            },{
                new:true
            });


            successHandle(res,httpStatus.OK,newArticle);
        } catch (error) {
            return appError(httpStatus.BAD_REQUEST, "修改貼文錯誤", next);
        }
    });
})

router.delete('/',async(req,res)=>{
    try {
        const newArticle= await postModel.deleteMany({});
        const afterDelete = await postModel.find() 

        successHandle(res,httpStatus.OK,afterDelete);
    } catch (error) {
        return appError(httpStatus.BAD_REQUEST, "刪除貼文錯誤", next);
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        const id = req.url.split('/').pop();
 
        
        const newArticle  = await postModel.findByIdAndDelete(id);
        if (!newArticle) {
            return appError(httpStatus.BAD_REQUEST, "找不到此貼文", next);
        }  

        const afterDelete = await postModel.find() ;
        successHandle(res,httpStatus.OK,afterDelete);
    } catch (error) {
        return appError(httpStatus.BAD_REQUEST, "刪除貼文錯誤", next);
    }
})



module.exports = router
