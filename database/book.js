const mongoose= require("mongoose");
//create book schema
const BookSchema= mongoose.Schema(
    {
        ISBN:String,
        title:String,
        pubDate:String,
        language:String,
        numPage:Number,
        author:[String],
        publications:[String],
        category:[String]
    }
);
const BookModel= mongoose.model("books",BookSchema);

module.exports = BookModel;