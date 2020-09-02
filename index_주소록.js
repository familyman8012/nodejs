var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// lesson1
// app.get('/', function(req, res){
//     res.send('hello world');
// })


/* lesson3 공통설정 */
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1

mongoose.connect(process.env.MONGO_DB); // 2
var db = mongoose.connection; //3
// 왠만해선 안변함


/* lesson3 
db.once('open', function(){
    console.log('DB connected');
})
db.on('error', function(err){
    console.log('db error:', err);
})
*/

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
 
var contactSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String},
    phone:{type:String}
});

var Contact = mongoose.model("contact", contactSchema);

app.get('/', function(req,res){
    res.redirect('/contacts');
});
app.get('/contacts', function(req,res){
    Contact.find({}, function(err, contacts){
        if (err) return res.json(err);
        res.render('contacts/index', {contacts:contacts});
    })
});
app.get("/contacts/new", function (req, res) {
  res.render("contacts/new");
});
app.post('/contacts', function(req,res){
    Contact.create(req.body, function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts')
    })
})

app.get('/contacts/:id', function (req, res) {
    console.log('a');
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render('contacts/show', { contact: contact });
    });
});

app.get('/contacts/:id/edit', function (req, res) {
    Contact.findOne({ _id: req.params.id }, function (err, contact) {
        if (err) return res.json(err);
        res.render('contacts/edit', { contact: contact });
    });
});

app.put('/contacts/:id', function(req, res){
    Contact.findOneAndUpdate({ _id: req.params.id}, req.body, function(err, contact){
        if (err) return res.json(err);
        res.redirect('/contacts/' + req.params.id);        
    })
})

app.delete('/contacts/:id', function(req, res){
    Contact.deleteOne({_id:req.params.id}, function(err, contact){
        if (err) return res.json(err);
        res.redirect('/contacts');
    })
})

// lesson2

// app.get('/hello', function(req,res){
//     res.render('hello', {name:req.query.nameQuery});
// });

// app.get("/hello/:nameParam", function (req, res) {
//   // 3
//   res.render("hello", { name: req.params.nameParam });
// });



var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:'+port);
});