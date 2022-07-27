//install: cheerio, express, axios (npm i ****)
const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { request, response } = require('express')

const app = express() // call express

const newspapers = [
    {
        name: 'apnews', 
        address: 'https://apnews.com/hub/gun-violence',
        base: 'https://apnews.com'
    },
    {
        name: 'guardian', 
        address: 'https://www.theguardian.com/world/gun-crime',
        base: ''
    },
    {
        name: 'nypost', 
        address: 'https://nypost.com/tag/shootings/',
        base: ''
    }
]

const articles = [] // arraylist to store recipes

// for each item, iterating 
newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then(response=> {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("shooting")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title, 
                url: newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})
// Homepage
app.get('/', (req, res) => {
    res.json('Welcome to My Mass Shooting News Api')
})

app.get('/news', (req,res) => {
    // axios.get('https://www.theguardian.com/world/gun-crime').then((response) =>
    //     {
    //         const html = response.data
    //         //console.log(html)
    //         const $ = cheerio.load(html)

    //         $('a:contains("shooting")', html).each(function(){
    //             const title = $(this).text()
    //             const url = $(this).attr('href')
    //             articles.push({
    //                 title, 
    //                 url
    //             })

    //         })
    //         res.json(articles)
    //     }).catch((err) => console.log(err))

    res.json(articles)
})

//get specific newspaper
app.get('/news/:newspaperId', (req, res)=> {
    const newspaperID = req.params.newspaperId

    const newsAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
    const newsBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base
    axios.get(newsAddress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("shooting")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url:newsBase + url, 
                source: newspaperID
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

//install nodemon globally
app.listen(PORT, () => console.log('Server running on PORT %d', PORT))

