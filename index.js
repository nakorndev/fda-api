const express = require('express')
const axios = require('axios')
const https = require('https')
const qs = require('querystring')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function unicodeToChar (text) {
  return text.replace(/\\u[\dA-F]{4}/gi,
    function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
}

app.post('/fda', async (req, res) => {
  try {
    const output = {}
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    })
    const $axios = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent
    })
    const { data } = await $axios.post('https://oryor.com/oryor2015/ajax-check-product.php', qs.stringify({
      number_src: req.body.number,
      type: 0
    }))
    const value = unicodeToChar(data)
    output.found = data.search('"type":0') < 0
    return res.send(output)
  } catch (error) {
    console.log(error)
    return res.send(error)
  }
})

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000/')
})
