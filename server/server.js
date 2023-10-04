const exp = require("express");
const cors = require("cors");
const mong = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const app = exp();
require("dotenv").config();

app.use(cors());
app.use(exp.json());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

//CRUD operations
app.get("/", (req, res)=>{
    res.send("Welcome to Conversa Chats");
})
mong.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err.message);
})

app.listen(process.env.PORT || 3001, ()=>{
    console.log("Server started on localhost:",process.env.PORT);
})