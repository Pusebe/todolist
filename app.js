const express = require ("express");
const app = express();
const today = require(__dirname + "/date.js");
const mongoose = require ("mongoose");

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

//creo el esquema de las tablas
const taskSchema = {
    task: String
};
//creo la tabla propiamente dicha
const Task = mongoose.model("Task", taskSchema);
//introduzco datos en la tabla
const newTask = new Task({
    task: "Tienes que tener al menos una cosa marcada Jude tonta!",
})

app.get("/", (req, res) => {

    Task.find({},(err, results)=>{
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
     });

});

app.post("/delete", (req, res) =>{

    console.log(req.body.delete); 
    Task.findByIdAndRemove( req.body.delete, (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("todo bien");
        }
    });

    res.redirect("/");
})


app.post("/", (req, res) =>{

    const newTask = new Task({
        task: req.body.addTask,
    });
 
    newTask.save();

    res.redirect("/");
})

app.listen(process.env.PORT || 4000, () => {
    console.log("Server está ahora en el 4000 o en el que diga la perra del servidor en el que lo alojaste cara perro");
}); 