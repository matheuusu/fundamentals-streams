import { createServer } from "node:http"

const users = []

const server = createServer(async (request, response) => {
  const { method, url } = request

  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    request.body = null
  }

  response.setHeader("Content-Type", "application/json")

  if (method === "GET" && url === "/users") {
    return response
      .end(JSON.stringify(users))
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = request.body

    users.push({
      id: 1,
      name,
      email
    })

    return response
      .writeHead(201)
      .end(JSON.stringify({ message: "The user has ben created" }))
  }

  return response.writeHead(404).end()
})

server.listen(3333, () => {
  console.log("Server is running")
})
