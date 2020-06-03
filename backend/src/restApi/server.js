import express from 'express'
import router from './route/router'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Definált utak hozááadása
app.use("/api", router)

// Nem definiált utak kezelése
app.get("*", function(req, res) {
   res.send("App works!")
})

app.listen(port, function() {
   console.log('Server started on port: ' + port);
})