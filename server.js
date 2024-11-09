import express from "express"
import cors from "cors"

const server = express()
const options = {
    origin: "http://localhost:3000",
    methods: "GET, POST"
}

server.use(cors(options))
server.use(express.json())

const PORT = 8080

server.get("/", (request, response) => {
    const jsonData = JSON.stringify({message: "Hello", status: "ok"})
    response.send(jsonData)
})

server.post("/count-words", (request, response) => {
    let text = request.body.text
    const withoutNumbers = Boolean(request.body.withoutNumbers)
    const uniqueWords = Boolean(request.body.uniqueWords)
    const caseSensitive = Boolean(request.body.caseSensitive)

    // handle case insensitive aspect
    if (!caseSensitive) {
      text=text.toLowerCase()
    }

    // split text based on two seperators
    let lines = text.split("\n")
    let phrases = []
    lines.map(line => {
        let linePhrases = line.split(/[' '*]/)
        linePhrases.map(phrase => {
            phrases.push(phrase)
        })
    })

    let total = phrases.length

    // delete phrases that are numbers so that only textual phrases are counted
    let delIndices = []
    if (withoutNumbers) {
        for (let i=0; i<phrases.length; i++) {
            if (!isNaN(phrases[i])) {
                delIndices.push(i)
            }
        }
        for (let i=delIndices.length-1; i>=0; i--) {
            phrases.splice(delIndices[i], 1)
        }
        total = phrases.length
    }

    // get only unique phrases
    if (uniqueWords) {
        phrases = new Set(phrases)
        total = phrases.size
    }

    const jsonData = JSON.stringify({words: total, status: "ok"})
    response.send(jsonData)
})

server.listen(PORT, () => {
    console.log(`Express node server is running at http://localhost:${PORT}/`)
})