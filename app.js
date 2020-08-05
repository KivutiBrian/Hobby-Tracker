const express = require('express')
const exphbs = require('express-handlebars')

const helpers = require('./utils/utils')


const app = express()

const hbs = exphbs.create({
    defaultLayout: "main",
    helpers: {
      section: function(name, options) { 
        if (!this._sections) this._sections = {};
          this._sections[name] = options.fn(this); 
          return null;
        }
    }    
});


app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// get the hobbies names
const dt = helpers.getData()

// get the hobby titles titles
const h_titles = dt.map(record => String(record.title))

// get ideal time(it)
const it = dt.map(record => record.ideal_time)

// get time spent(ts)
const ts = dt.map(record => record.time_spent)



// create a new hobby || make a POST request
app.post('/add-hobby', (req, res)=>{

    // get current data from the json file
    const data = helpers.getData()
    
    // new payload
    const hobby = {
        id:data.length +1,
        title: req.body.title,
        ideal_time: req.body.time,
        time_spent:0
    }

    // check if payload contains null values
    if( !hobby.title || !hobby.ideal_time ){
        res.redirect('/')
    }

    // append the data
    data.push(hobby)

    // save the data
    helpers.saveData(data)

    
    res.redirect('/')

})


// edit || make us of web-services
app.post('/edit-hobby/:id', (req,res, next)=>{

    // get current data from the json file
    let data = helpers.getData()

    // use some method to test whether at least one element in the array passes the test
    const found = data.some(record => record.id === parseInt(req.params.id))

    if(found){
        const update_record = req.body

        // use forEach to call a function once for each element in a array || in this case update each field in the json file
        data.forEach(record =>{
            if(record.id === parseInt(req.params.id)){
                record.title = update_record.title ? update_record.title : record.title
                record.ideal_time = update_record.ideal_time ? update_record.ideal_time : record.ideal_time
                record.time_spent = update_record.time_spent ? update_record.time_spent : record.time_spent

                // save data
                helpers.saveData(data)
                        
                res.redirect('/')

                window.location.reload()
            }
        })    
    }else{
        res.redirect('/')
    }

})


// delete a record
app.post('/delete-hobby/:id', (req,res)=>{

    // get current data from the json file
    let data = helpers.getData()
    
    // use some method to test whether at least one element in the array passes the test
    const found = data.some(hobby => hobby.id === parseInt(req.params.id))

    if(found){


        const new_data = data.filter(record=>record.id != parseInt(req.params.id))
        data = new_data

        // save the data
        helpers.saveData(data)

        res.redirect('/')

    }else{
        
        res.redirect('/')
    }

})


app.get('/', (req,res)=>{
    res.render('index', {
        data: helpers.getData(),
        estimated_time: it,
        time_spent: ts,
        labels: encodeURIComponent(JSON.stringify(h_titles))        
    })
})



const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
    console.log(`server started and running on port ${PORT}`)
})