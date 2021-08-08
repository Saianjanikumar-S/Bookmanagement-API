const { json } = require("express");
const express=require("express");

//Database
const database=require("./dataset");

//initialise express
const booky = express();

/*
Route          /
Description   Get all the books
Access        public
Parameter     None
Methods       get
*/
booky.get("/",(req,res)=>{
    return res.json({books:database.books});
});


/*
Route          /is
Description   Get a specific book  by isbn
Access        public
Parameter     isbn
Methods       get
*/
booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook= database.books.filter(
        (book)=> book.ISBN=== req.params.isbn
    );

    if(getSpecificBook.length===0){
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
booky.get("/cat/:category",(req,res)=>{
    const getSpecificBook= database.books.filter(
        (book)=> book.category.includes(req.params.category)//to iterate in array{category}
    );
    if(getSpecificBook.length===0){
        return res.json({error:`No book for the category of ${req.params.category}`})
    } 
    return res.json({book:getSpecificBook})
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
booky.get("/auth",(req,res)=>{
    return res.json({auth: database.author});
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
booky.get("/pub",(req,res)=>{
    return res.json({publications:database.publications})
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

booky.listen(4488,()=>{
    console.log("Server is up and running");
});

