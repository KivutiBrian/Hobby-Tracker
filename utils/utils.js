const fs = require('fs')

// read from json file
const getData = ()=>{
    const jsonData = fs.readFileSync('data.json')
    return JSON.parse(jsonData)
}

// create || POST data
const saveData = (data)=>{
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('data.json', stringifyData)
}

module.exports = {
    getData,
    saveData
}
