exports.date = () => {

    let date = new Date();

let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
};

return date.toLocaleDateString("es-ES", options);

}
