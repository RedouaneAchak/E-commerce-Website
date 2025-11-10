const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
 const authRoutes = require('./features/auth/auth.routes');
productRoutes = require('./features/products/product.routes');
orderRoutes = require('./features/orders/order.routes');
// const paymentRoutes = require('./features/payment/payment.routes');
// const webhookRoutes = require('./features/webhooks/webhook.routes');

const app= express();

app.use(helmet());
app.use(cors());
//app.use('/weebhooks/stripe',weebhooksRoutes);
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("API is running...");
})
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
// app.push('/api/v1/payment', paymentRoutes);

app.use((req,res,next)=>{
    const error= new Error(`not found ${req.originalUrl}`);
    res.status(404);
    next(error);
})
app.use((err,req,res,next)=>{
    const statusCode= res.statuscode===200? 500: res.statuscode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV==='development'? err.stack: 'X'});
    })
module.exports= app;