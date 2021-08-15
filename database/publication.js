const mongoose= require("mongoose");
//create publication schema
const PublicationSchema= mongoose.Schema(
    {
        id:String,
        name:String,
        books:[String]
    }
);
const PublicationModel= mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;