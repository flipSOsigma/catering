import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'https://catering-fe.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

const port = process.env.PORT
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/testing', (req, res) => {
  res.json({msg: 'Hallo Jawa!'})
})

const routesPath = path.resolve(__dirname, "routes");
const routesFolder = fs.readdirSync(routesPath);

function loadRoutesRecursively(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadRoutesRecursively(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      import(fullPath).then((route) => {
        app.use("/", route.default);
      }).catch((err) => {
        console.error(`Failed to load route ${fullPath}:`, err);
      });
    }
  }
}

loadRoutesRecursively(routesPath);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
