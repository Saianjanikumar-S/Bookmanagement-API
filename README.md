# Bookmanagement-API

Requirements for Bookmangement-API

BOOKS:-
ISBN,title,pub date,language,num of pages,author[],category[]

AUTHORS:-
id,name,books[]

PUBLICATIONS:-
id,name,books[]

API's:-

For BOOKS:-
to get all the books 
,to get a specific book 
,to get a list of books based on category 
,to get a list of books based on languages

For AUTHORS:-
to get all the authors
,to get a specific author
,to get a list of authors based on books

For PUBLICATIONS:-
,to get all the PUBLICATIONS
,to get a specific PUBLICATIONS 
,to get a list of publications based on books 

POST REQUESTS:
add new book
,add new publication
,add new author
 
PUT REQUESTS:
Update book details if author is changed

DELETE REQUESTS:
delete a book
,delete author from book
,delete author from book and related book from author
