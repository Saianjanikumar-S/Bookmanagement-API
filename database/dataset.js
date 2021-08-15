const books=[
    {
        ISBN:"1234book",
        title:"tesla",
        pubDate:"2021-08-05",
        language:"en",
        numPage:"250",
        author:["1","2"],
        publications:["1"],
        category:["tech","space","education"]
    }
]

const author=[
    {
        id:"1",
        name:"Sai",
        books:["1234book","secretbook"]
    },
    {
        id:"2",
        name:"Bhargav",
        books:["1234book","howToGrowTall"]
    }
]

const publications=[
    {
        id:"1",
        name:"spacex",
        books:["1234book"]
    },
    {
        id:"2",
        name:"space2x",
        books:[]
    }
]

module.exports= {books,author,publications};