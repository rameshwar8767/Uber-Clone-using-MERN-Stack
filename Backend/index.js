const dotenv = require('dotenv')
dotenv.config();
const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 8080
server.listen(port,()=>{
    try {
        console.log(`server is running on port : ${port}`);
        
    } catch (error) {
        console.error("error occured in listening", error);
        
    }
})
