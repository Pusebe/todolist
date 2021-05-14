const express = require ("express");
const app = express();
let task = [];

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    
    let date = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = date.toLocaleDateString("es-ES", options);
    
    res.render("list", {dayOfWeek: day, newTask: task}); // esto es la carpeta que metisete en views capuyo

});

app.post("/", (req, res) =>{

    task.push(req.body.addTask);

    res.redirect("/");
    console.log(task);

})

app.listen(process.env.PORT || 4000, () => {
    console.log("Server está ahora en el 4000 o en el que diga la perra del servidor en el que lo alojaste cara perro");
});