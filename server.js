require('dotenv').config();
const express= require('express');
const mongoose= require('mongoose');
const cors = require('cors');

const app= express();
const PORT = process.env.PORT|| 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('blog database is connected')).catch((err)=>console.log('database error',err.message));


app.get('/',(req,res)=>{
    res.send('blog API is running..........')
});
app.listen(PORT,()=>{
    console.log(`blog server runnging http://localhost:${PORT}`);
})