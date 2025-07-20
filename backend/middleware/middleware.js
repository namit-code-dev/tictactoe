const middlewares = (app)=>{
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signup",signup)
}
module.exports=middlewares