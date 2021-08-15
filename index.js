require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
var bodyParser= require("body-parser");

//Database
const database=require("./database/dataset");

//Models
const BookModel= require("./database/book");
const AuthorModel= require("./database/author");
const PublicationModel= require("./database/publication");

//initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json()); 

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=> console.log("Connection established"));

/*
Route          /
Description   Get all the books
Access        public
Parameter     None
Methods       get
*/
booky.get("/",async (req,res)=>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});


/*
Route          /is
Description   Get a specific book  by isbn
Access        public
Parameter     isbn
Methods       get
*/
booky.get("/is/:isbn",async (req,res)=>{
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    //null
    if(!getSpecificBook){
        return res.json({error: `No book found for thr ISBN of ${req.params.isbn}`});
    }
    return res.json({book: getSpecificBook})
});

/*
Route          /cat
Description   Get a books  by category
Access        public
Parameter     category
Methods       get
*/
booky.get("/cat/:category",async (req,res)=>{
    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    //null
    if(!getSpecificBook){
        return res.json({error: `No book found for thr category of ${req.params.category}`});
    }
    return res.json({book: getSpecificBook})
});

/*
Route          /lan
Description   Get a books  by languages
Access        public
Parameter     language
Methods       get
*/
booky.get("/lan/:lang",(req,res)=>{
    const getSpecificBook= database.books.filter(
        (book)=>book.language=== req.params.lang
    );
    if(getSpecificBook.length==0){
        return res.json({error:`No book for the language ${req.params.lang}`});
    }
    return res.json({book: getSpecificBook})
});

/*
Route          /auth
Description   Get all the authors
Access        public
Parameter     authors
Methods       get
*/
booky.get("/auth",async (req,res)=>{
    const getAllAuthors= await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*
Route          /auth
Description   Get a specific author based on id
Access        public
Parameter     author
Methods       get
*/
booky.get("/auth/:ID",(req,res)=>{
    const getSpecificAuthor= database.author.filter(
        (author)=> author.id === req.params.ID
    );
    if(getSpecificAuthor.length==0){
        return res.json({error:`No author found by the ID of ${req.params.ID}`});
    }
    return res.json({author: getSpecificAuthor})
});

/*
Route          /auth/book/
Description   Get all authors by books
Access        public
Parameter     authors
Methods       get
*/
booky.get("/auth/book/:isbn",(req,res)=>{
    const getSpecificAuthor= database.author.filter(
        (author)=> author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length===0){
        return res.json({error:`No author found for the book of ${req.params.isbn}`})
    }
    return res.json({author:getSpecificAuthor});
});


/*
Route          /pub
Description   Get all publications
Access        public
Parameter     publication
Methods       get
*/
booky.get("/pub",async (req,res)=>{
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

/*
Route          /pub
Description   Get a specific publications by id
Access        public
Parameter     publications
Methods       get
*/
booky.get("/pub/:ID",(req,res)=>{
    const getSpecificPublication=database.publications.filter(
        (publications)=> publications.id === req.params.ID
    );
    if(getSpecificPublication.length==0){
        return res.json({error:`No publication found for the id of ${req.params.ID}`})
    }
    return res.json({publications: getSpecificPublication})
});

/*
Route          /pub/book/
Description   Get all publications by books
Access        public
Parameter     authors
Methods       get
*/
booky.get("/pub/book/:isbn",(req,res)=>{
    const getSpecificPublication= database.publications.filter(
        (publications)=>publications.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length==0){
        return res.json({error:`No publication found for the book of ${req.params.isbn}`})
    }
    return res.json({publications:getSpecificPublication})
});

//POST
/*
Route         /book/new
Description   Add new books
Access        public
Parameter     none
Methods       post
*/
booky.post("/book/new",async(req,res)=>{
    const {newBook} = req.body;
    const addNewBook=BookModel.create(newBook);
    return res.json({
        books:addNewBook,
        message:"Book was added"
    });
});

/*
Route         /author/new
Description   Add new author
Access        public
Parameter     none
Methods       post
*/
booky.post("/author/new",async(req,res)=>{
    const {newAuthor}=req.body;
    const addNewAuthor= AuthorModel.create(newAuthor);
    return res.json({
        author: addNewAuthor,
        message:"Author was added"
    });
});

/*
Route         /publication/new
Description   Add new publication
Access        public
Parameter     none
Methods       post
*/
booky.post("/publication/new",async (req,res)=>{
    const {newPublication}= req.body;
    const addNewPulicaton= PublicationModel.create(newPublication);
    return res.json({
        publication: addNewPulicaton,
        message:"Publication was added"
    });
});

/********PUT*********/
/*
Route         /book/update
Description   update book on ISBN
Access        public
Parameter     isbn
Methods       put
*/
booky.put("/book/update/:isbn",async(req,res)=>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN:re.params.isbn
        },{
            title: req.body.bookTitle
        },
        {
            new :true
        }
    );
    return res.json({
        books: updatedBook
    });
});


/**********updating new author**********/
/*
Route         /book/author/update
Description   update book on ISBN
Access        public
Parameter     isbn
Methods       put
*/
booky.put("/book/author/update/:isbn",async(req,res)=>{
    //update book db
    const updatedBook= await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet:{
                authors:req.body.newAuthor
            }
        },{
            new: true
        }
    );
    //update author db
    const updatedAuthor= await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },{
            new: true
        }
    );
    return res.json({
        books:updatedBook,
        authors:updatesAuthor,
        message:"New added was added"
    });
});












//PUT
/*
Route         /publication/update/book
Description   update/add new publication
Access        public
Parameter     isbn
Methods       put
*/
booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update pub database
    database.publications.forEach((pub)=>{
        if(pub.id=== req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN=== req.params.isbn){
            book.publication= req.body.pubId;
            return;
        }
    });
    return res.json({
        books:database.books,
        publications: database.publications,
        message: "Succesfully updated publications"
    });
}); 


//DELETE
/*
Route         /book/delete
Description   delete a book
Access        public
Parameter     isbn
Methods       delete
*/
booky.delete("/book/delete/:isbn",async (req,res)=>{
    //whichever book doesnt match with isbn,send it to updated book database and rest will be filtered out
   const updatedBookDatabase= await BookModel.findOneAndDelete (
       {
           ISBN: req.params.isbn
       }
   );
   return res.json({
       books: updatedBookDatabase
   });
});

/*
Route         /book/delete/author
Description   delete author from book and vice versa
Access        public
Parameter     isbn,authorId
Methods       delete
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== req.params.authorId
       );
       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === req.params.authorId) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});

booky.listen(4488,()=>{
    console.log("Server is up and running");
});

