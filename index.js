const Express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
// connection factory
const knex = require('knex');
const multer = require('multer');
const dbConfig = require('./knexfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// create an express instance
const express = new Express();
const events=require('events');
const path = require('path');
express.use(cors());
express.use(bodyParser.json());
var uploadRouter=require('./upload.js')

// ** this is is client connection
const dbClient = knex(dbConfig);
const secret='IShan123';

express.use(Express.static(path.join(__dirname, 'public')));


function sendHealthStatus(req, resp) {
  resp.json({
    status: 'ok'
  })
  
}

function getVersion(req, res) {
  // send me a version
  res.json({version: '0.0.0'});           
}


function registerUser(request, response) {
  console.log(request.body);
  // get username
  const name = request.body.name;
  
  const email = request.body.email;
  const address=request.body.address;
  const phone=request.body.phone;
  // get password
  const password = request.body.password;

  const hashedPassword = bcrypt.hashSync(password, 10);
  dbClient
    .table('User')
    .insert({
      // this must be same for database's column how to use authentication in middleware
      name,
      address,
        phone,
      email:email,
      password: hashedPassword
    })
    .then(data => {
      response.json({
        status: 'success',
        data: {
          name: name,
        }
      })  
    })
    .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}
function registerhotel(request,response){
  const name = request.body.name;
  const detail= request.body.detail;
  const price=request.body.price;
  const hotel_image=request.body.hotel_image;
 
dbClient
.table('Hotel')
.insert({
  name,
        detail,
        price:price,
        hotel_image:hotel_image
})
.then(data =>{
  response.json({
    status:success,
    data:{
      name:name,
    }
  })
})
 .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}
function registerbooking(request,response){
   const name = request.body.name;
  const date_from= request.body.date_from;
  const date_to= request.body.date_to;
  const hotel_name=request.body.hotel_name;
  
dbClient
.table('Booking')
.insert({
  name,
        date_from,
        date_to,
        hotel_name,

})
.then(data =>{
  response.json({
    status:success,
    data:{
      data:data
    }
  })
})
 .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}

async function authenticate(request,response){
  const name=request.body.name;
  const fontpassword=request.body.password;

 
  // const data = await dbClient.table('users').first('password').where('username', username);
  const data = await dbClient.table('User').select().where({name:name});

  if(!data){
    response.json({
      status:'fail',
      message:'user not found'
    })
  }else{
     
      const password=data[0].password;
      const compare=bcrypt.compareSync(fontpassword, password);
      
      if(compare){
       response.json({
        status: 'success',
        success:true,
        id: data[0].id,
        name:data[0].name,
        
        accessToken: jwt.sign({
          name,
          
          
        },secret)
      })
     }
       
      
      else{
        response.json({
          status:'fail',
    
        })
      }
    }
  }

// create a auth handler
function unauthenticated(response){
  response.json({
    status:'fail',
    message:'not authenticated',
      code: 404
  })
}
function tokenauth(token){
    if (!token) {
    return false;
  }
  try {
    const payload = jwt.verify(token, secret);
    return payload;
    // use payload if required
  } catch(error) {
    return false
  }
}

async function getUsers(request, response) {
     
      
   if (tokenauth(request.header.authorization) ==false) {
    unauthenticated(response);
    return;
  }try{
    console.log(request);
  const data = await dbClient.table('User').select('name');
      response.json({
                status: 'success',
        data: data
      })
    }
  
  catch(error){
    unauthenticated(response);
    return;

  }
}
     async function gethotells(request,response){
  try{
    const data = await dbClient.table('Hotel').select();
    response.json(
     
      data
    )
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
      }
     
async function displayuser(request,response){
  try{
    const data = await dbClient.table('User').select('name');
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
}
async function gethotels(request,response){
  try{
    const data = await dbClient.table('Hotel').select();
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
      }
 async function displayuser(request,response){
  try{
    const data = await dbClient.table('User').select('name');
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
}
async function getalluser(request,response){
  try{
    const data= await dbClient.table('User').select();
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
}


function getuser(request,response){
  const isAuthenticated = tokenauth(request.headers.authorization);
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    unauthenticated(response);
    return;
  }
  dbClient
    .table('User')
    .where({
      name: isAuthenticated.name
    })
    .select()
    .then(data => {
      response.json({
        status: 'success',
        data: data
      })
    })
    .catch(error => {
      response.json({
        status: 'fail',
        error: error.toString()
      })
    })
}

function deletebook(request,response){
  const id= request.body.id;
  dbClient
  .table('Booking')
  .delete()
  .where({
    id:id
  })
  .then(data => {
    response.json({
      status:"deleted sucessfully"
    
    })

  })
  .catch(error =>{
    response.json({
      status:"fail"
    })
  })
}
function userdelete(request,response){
  const id= request.body.id;
  dbClient
  .table('User')
  .delete()
  .where({
    id:id
  })
  .then(data => {
    response.json({
      status:"deleted sucessfully"
    })

  })
  .catch(error =>{
    response.json({
      status:"fail"
    })
  })
}

function Hoteldelete(request,response){
  const id= request.body.id;
  dbClient
  .table('Hotel')
  .delete()
  .where({
    id:id
  })
  .then(data => {
    response.json({
      status:"Deleted sucessfully"
    })

  })
  .catch(error =>{
    response.json({
      status:"fail"
    })
  })
}

async function gethotelid(request,response){
        const page= request.query.page;
  try{
    const data = await dbClient.table('hotel').select().where({id:page});
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
      }

async function hoteldisplay(request,response){
let page=request.query.page;
console.log(request.query.page)
 
 
  try{
    const data= await dbClient.table('Hotel').select().where({id:page});
    response.json({
      status:'success',
      data:data
    })

  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
}
function updatehot(request,response){
  
const id = request.body.id;
   const name = request.body.name;
  const detail= request.body.detail;
  const price=request.body.price;
  dbClient
  .table('Hotel')
  .update({
   name,
   detail,
   price

  })
  .where({
      id: id
    })
    
  .then(data =>{
    response.json({
      status:'success',
      data:{
        name:name,
      }
    })
  })
  .catch(error=>{
    response.json({
      status:'fail'
    })
  })
}
function updateuser(request,response){
  
const id = request.body.id;
   const name = request.body.name;
  const address= request.body.address;
  const password=request.body.password;
  const phone=request.body.phone;
  const email=request.body.email;
  dbClient
  .table('User')
  .update({
   name,
   phone,
   address,
   email,
   password

  })
  .where({
      id: id
    })
    
  .then(data =>{
    response.json({
      status:'success',
      data:{
        name:name,
      }
    })
  })
  .catch(error=>{
    response.json({
      status:'fail'
    })
  })
}
// const sendinquiry=(req,res)=>{
//   const inquirydetails=req.body;
//   console.log(inquirydetails);
//   dbClient("inquiry").insert(inquirydetails).then(()=>res.json({
//     status:true, message:"Message inserted!"
//   })).catch(err=>res.json({
//     status:false, message: err.message
//   }));
// }
function sendinquiry(request, response) {
  console.log(request.body);
  // get username
  
  const email = request.body.email;
  const message=request.body.message;
  // get password
 
  dbClient
    .table('inquiry')
    .insert({
      // this must be same for database's column how to use authentication in middleware
      email,
    
      message
    })
    .then(data => {
      response.json({
        status: 'success',
        data: {
          email: email,
        }
      })  
    })
    .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}

async function getbook(request,response){
  try{
    const data = await dbClient.table('Booking').select();
    response.json({
      status:'sucess',
      data:data
    })
  }
  catch(error){
    response.json({
      status:'fail'
    })
  }
      }
express.get('/api/getbook',getbook);
express.get('/api/health', sendHealthStatus);
express.get('/api/version', getVersion);
express.get('/api/alluser', getalluser);
express.delete('/api/del', deletebook);   
express.post('/api/auth', authenticate);
express.delete('/api/deleteuser', userdelete);
express.delete('/api/deletehotel', Hoteldelete);
express.put('/api/updateuser', updateuser);
express.post('/api/hotel',registerhotel);
express.use('/api/upload', uploadRouter);
express.post('/api/register', registerUser);
express.post('/api/registerbooking', registerbooking);
express.get('/api/gethotels', gethotels);
express.get('/api/gethotells', gethotells);
express.get('/api/gethotelid', gethotelid);
express.get('/api/users/:user', getuser );
express.get('/api/admin', hoteldisplay);
express.put('/api/updatehot', updatehot);
express.get('/api/display',displayuser);
express.get('/api/display/:id',displayuser);
express.post('/api/sendinquiry', sendinquiry);
express.listen(8000, 'localhost', () => {
  console.log("Server is running at ", 8000)
})


// migration in knex

