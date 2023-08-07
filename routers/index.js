const Router = require('koa-router');
const router = new Router();

const ApiRouter=require('./ApiRouter');

router.use("/api", ApiRouter.routes(), ApiRouter.allowedMethods());

module.exports=router;