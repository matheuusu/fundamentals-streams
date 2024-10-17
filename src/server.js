import { createServer } from "node:http"
import { json } from "./middlewares/json.js"
import { Database } from "./database.js"
import { randomUUID } from "node:crypto"

const database = new Database()

const server = createServer(async (request, response) => {
  const { method, url } = request

  await json(request, response)

  if (method === "GET" && url === "/users") {
    const users = database.select('users')

    return response
      .end(JSON.stringify(users))
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = request.body

    const user = {
      id: randomUUID(),
      name,
      email
    }

    database.insert('users', user)

    return response
      .writeHead(201)
      .end(JSON.stringify({ message: "The user has ben created" }))
  }

  return response.writeHead(404).end()
})

server.listen(3333, () => {
  console.log("Server is running")
})
