const express=require("express");
var bodyParser= require("body-parser");

//Database
const database=require("./dataset");

//initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json()); 

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

//POST
/*
Route         /book/new
Description   Add new books
Access        public
Parameter     none
Methods       post
*/
booky.post("/book/new",(req,res)=>{
    const newBook=req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route         /author/new
Description   Add new author
Access        public
Parameter     none
Methods       post
*/
booky.post("/author/new",(req,res)=>{
    const newAuthor= req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthor: database.author});
});

/*
Route         /publication/new
Description   Add new publication
Access        public
Parameter     none
Methods       post
*/
booky.post("/publication/new",(req,res)=>{
    const newPublication= req.body;
    database.publications.push(newPublication);
    return res.json({updatedPublications: database.publications});
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
booky.delete("/book/delete/:isbn",(req,res)=>{
    //whichever book doesnt match with isbn,send it to updated book database and rest will be filtered out
    const updatedBookDatabase = database.books.filter(
        (book)=> book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
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

