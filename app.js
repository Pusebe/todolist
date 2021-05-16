const express = require ("express");
const app = express();
const today = require(__dirname + "/date.js");
const mongoose = require ("mongoose");
const _ = require ("lodash");

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//creo el esquema de las tablas
const taskSchema = {
    task: String
};

const listSchema = {
    name: String,
    task: [taskSchema]
}

//creo la tabla propiamente dicha
const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", listSchema)
//introduzco datos en la tabla
const newTask = new Task({
    task: "Tienes que tener al menos una cosa marcada Jude tonta!",
})

app.get("/", (req, res) => {

    Task.find({},(err, results)=>{
        if(err){console.log("este error")}
        else{
            if (results.length === 0){
                Task.insertMany(newTask, (err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(newTask + " Tienes que tener al menos una cosa marcada Jude tonta!");
                    }
                });
                res.redirect("/");
            }else{
                day = today.date();
                res.render("list", {dayOfWeek: day, newTask: results}); // esto es la carpeta que metisete en views capuyo
            }
        }
     });
});
app.get("/:name", (req, res)=>{

    address = _.capitalize(req.params.name);

    List.findOne({name: address}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(!result){
                console.log(result +" esto no estaba creado");
                const newList = new List({
                    name: address,
                    task: []
                });
                newList.save();
                res.redirect("/" + address);
            }
            else{
                console.log("esto si estaba creado"); 
                res.render("list", {dayOfWeek: result.name, newTask: result.task});
            }
        }
    });    
});

app.post("/delete", (req, res) =>{
    if(req.body.address === today.date()){
        Task.findByIdAndRemove(req.body.delete, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("todo bien");
            }
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name : req.body.address},{$pull: {task :{_id: req.body.delete}}}, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("todo bien s " + req.body.delete);
            }
        });
        res.redirect("/" + req.body.address);
    }
})


app.post("/", (req, res) =>{

    const newTask = new Task({
        task: req.body.addTask,
    });
    if(today.date()=== req.body.list)
    {
        newTask.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: req.body.list}, (err, result)=>{
            if(!err){
                result.task.push(newTask);
                result.save();
                res.redirect("/" + req.body.list);
            }
            else{
                console.log("hubo algun error");
            }
        });
    }

});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server está ahora en el 4000 o en el que diga la perra del servidor en el que lo alojaste cara perro");
}); 