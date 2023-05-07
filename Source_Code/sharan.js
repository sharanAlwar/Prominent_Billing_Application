const express=require('express')
const app=express()
const fs = require('fs');
app.use(express.static('assets'));

const output = fs.readFileSync(__dirname+'/user.html','utf-8');
const invoice = fs.readFileSync(__dirname+'/invoice.html','utf-8');
const validation = fs.readFileSync(__dirname+'/validation.html','utf-8');
var mongoose=require('mongoose')
var bodyparser=require('body-parser')
app.use(bodyparser.json())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({
    extended:true
}))
//local connection String:
// mongodb://localhost:27017/Sharan
//Cloud connection String:
// mongodb+srv://Saarani:6382117902@cluster0.5uqyt8v.mongodb.net/MiniProject
mongoose.connect("mongodb+srv://sharan:6382117902@cluster0.tz2r8ee.mongodb.net/test",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

var db=mongoose.connection
db.on('error',()=>console.log('AWS Server under Maintenence'))
db.once('open',()=>{
    console.log("connected to AWS N. Virginia (us-east-1)")
})
// app.get('/',(req,res)=>{
//     res.sendFile
// })
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})
app.get('/button',(req,res)=>{
    res.sendFile(__dirname + '/button.html');
})
app.get('/Sig',(req,res)=>{
    res.sendFile(__dirname + '/Signin.html');
})
app.get('/Create',(req,res)=>{
    res.sendFile(__dirname + '/Create.html');
})

app.get('/Signin',(req,res)=>{
    var uuser = req.query;
    var obj={
        "Phone_number":parseInt(uuser.ph),
        "email":uuser.email,
        "password":uuser.pswd
    }
    db.collection('coll').insertOne(obj,(err,data)=>{
        if(err) throw err;
        console.log("New account created for : "+ uuser.ph );
        console.log(data);
    })
    res.sendFile(__dirname + '/Signin.html');
})
var u;
var ph;
app.get('/user',(req,res)=>{
    var user = req.query;
    u = user;
    ph = parseInt(user.ph);
    // ph = user.ph;
    var pswd = user.pswd;
    // res.sendFile(__dirname + '/login.html');
    // db.collection('coll').findOne({"Phone_number":ph,"password":pswd},(err,data)=>{
    db.collection('coll').findOne({"Phone_number":ph},(err,data)=>{
        if(err){
            throw err;
        }else{
            // console.log(data);
            // console.log(ph);
            // console.log(u);
            if(data != null){
                let o = output.replace('{%ph%}', data.Phone_number);
                o=o.replaceAll('{%email%}', data.email);
                o=o.replace('{%plan%}', data.plan);
                o=o.replace('{%date%}', data.date);
                res.send(o);
            }else{
                res.sendFile(__dirname + "/SignFail.html");
                // res.send("<script> window.alert("Wrong Credentio"); </script>");
            }
        }
    })
})
app.get('/payment',(req,res)=>{
    res.sendFile(__dirname + '/payment.html');
})
var y;
app.get('/validation',(req,res)=>{
    db.collection('coll').updateOne({Phone_number:ph},{$set:{plan:req.query.radio}},(err,data)=>{
        if(err){
            throw err;
        }else{
            y=req.query.radio;
            u=data;
            // console.log(data);
            let z;
            if(y=="Platinum"){
                z = validation.replace('{%amt%}', 3449.99);
                res.send(z);
           }else if(y=="Premium"){
                z = validation.replace('{%amt%}', 2699.99);
                res.send(z);
           }else if(y=="Basic"){
                z = validation.replace('{%amt%}', 999.99);
                res.send(z);
           }
            res.sendFile(__dirname + "/validation.html");
        }
})
})
// app.get('/valid',(req,res)=>{
//     console.log("hi")
//     let z;
//     if(y=="Basic"){
//          z = validation.replace('{%amt%}', 999);
//     }
//     res.send(z);
// })
var v ;
app.get('/invoice',(req,res)=>{
    var cd = req.query;
    var cardObj = {
        Name_On_Card : cd.Name_On_Card,
        Card_Number : cd.Card_Number,
        Expiry : cd.Expiry,
        CVV : cd.CVV,
        plan : "NA",
        date : "NA"
    }
    db.collection('Card_Details').insertOne(cardObj , (err,data)=>{
        if(err) throw err;
        console.log("Card Details added to AWS N. Virginia (us-east-1) :");
        console.log(cardObj);
    })
    //to find and replace in next page[invoice]
    db.collection('coll').findOne({"Phone_number":ph},(err,data)=>{
        if(err){
            throw err;
        }else{
        //     var dateToday =  new Date().setFullYear(new Date().getFullYear() + 2);
        //     db.collection('coll').updateOne({Phone_number:ph},{$set:{date:dateToday}},(err,data)=>{
        //     if(err){
        //         throw err;
        //     }else{

        //     }
        // })
            let x;
            x = invoice.replace('{%mail%}', data.email);
            x=x.replaceAll('{%plan%}', data.plan);    
            if(data.plan=='Basic'){
                var s = "Includes Disney , Netflix & Voot";
                x=x.replaceAll('{%description%}', s); 
                var random = Math.floor(Math.random() * 100);
                random = "B"+random;
                x=x.replace('{%invoice%}',random);
                var r = "0005181142"
                x=x.replaceAll('{%plan_id%}', r); 
                v = "547";
                x=x.replaceAll('{%validity%}', v); 
                var c = 1200;
                x=x.replaceAll('{%cost%}', c);
                var d = 15;
                x=x.replaceAll('{%discount%}', d); 
                var a = 999.99;
                x=x.replaceAll('{%amt%}', a);
                x=x.replaceAll('{%ph%}', data.Phone_number);
                // d.setDate(d.getDate() + 365);
                var dateToday = new Date();
                dateToday.setDate(dateToday.getDate()+v);
                var s = dateToday.toString();
                // s=s.substring(0,15);
            db.collection('coll').updateOne({Phone_number:ph},{$set:{date:s}},(err,data)=>{
            if(err){
                throw err;
            }else{
                
            }
        })
            }else if(data.plan=='Premium'){
                var s = "Includes Disney , Netflix , Voot & Hulu";
                x=x.replaceAll('{%description%}', s); 
                var random = Math.floor(Math.random() * 100);
                random = "Pre"+random;
                x=x.replace('{%invoice%}',random);
                var r = "0005148156"
                x=x.replaceAll('{%plan_id%}', r); 
                v = "657";
                x=x.replaceAll('{%validity%}', v); 
                var c = 3299.99;
                x=x.replaceAll('{%cost%}', c);
                var d = 20;
                x=x.replaceAll('{%discount%}', d); 
                var a = 2699.98;
                x=x.replaceAll('{%amt%}', a);
                x=x.replaceAll('{%ph%}', data.Phone_number);
                var dateToday = new Date();
                dateToday.setDate(dateToday.getDate()+v);
                var s = dateToday.toString();
                // s=s.substring(0,15);
            db.collection('coll').updateOne({Phone_number:ph},{$set:{date:s}},(err,data)=>{
            if(err){
                throw err;
            }else{
                
            }
        })
            }else if(data.plan == 'Platinum'){
                var s = "Includes Disney , Hulu , Voot , Netflix and Prime";
                x=x.replaceAll('{%description%}', s); 
                var random = Math.floor(Math.random() * 100);
                random = "Pla"+random;
                x=x.replace('{%invoice%}',random);
                var r = "0005160145"
                x=x.replaceAll('{%plan_id%}', r); 
                let vv = "730"; 
                x=x.replaceAll('{%validity%}', vv); 
                var c = 4119.98;
                x=x.replaceAll('{%cost%}', c);
                var d = 20;
                x=x.replaceAll('{%discount%}', d); 
                var a = 3449.99;
                x=x.replaceAll('{%amt%}', a);
                x=x.replaceAll('{%ph%}', data.Phone_number);
                let dateToday = new Date();
                // console.log(dateToday);
                dateToday.setDate(dateToday.getDate()+vv);
                let saran = dateToday.toString();
                // console.log(saran);
                // saran=saran.substring(0,15);
                // console.log(saran);
            db.collection('coll').updateOne({Phone_number:ph},{$set:{date:saran}},(err,data)=>{
            if(err){
                throw err;
            }else{
                console.log("Thank You for choosing Prominent Billing");
            }

        })
            }else{
                console.log("User "+data.email+" hasn't choose a plan");

            }
            res.send(x);
        }
    })
})

app.get('/delete',(req,res)=>{
    db.collection('coll').updateOne({Phone_number:ph},{$set:{date:"NA" , plan:"NA"}},(err,data)=>{
        if(err){
            throw err;
        }else{
            console.log("All Current Plans Cancelled as per Request!!");
            console.log("For Phone Number: "+ph);
        }
    })
    // console.log("All Current Plans Cancelled as per Request!! \n For Phone Number:" + ph);
    res.sendFile(__dirname+'/index.html');
})

app.listen(3133,()=>{
    console.log("port 3133");
})
