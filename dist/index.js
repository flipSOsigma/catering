"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'https://catering-fe.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/testing', (req, res) => {
    res.json({ msg: 'Hallo Jawa!' });
});
const routesPath = path_1.default.resolve(__dirname, "routes");
const routesFolder = fs_1.default.readdirSync(routesPath);
function loadRoutesRecursively(dir) {
    const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadRoutesRecursively(fullPath);
        }
        else if (entry.isFile() && entry.name.endsWith(".js")) {
            Promise.resolve(`${fullPath}`).then(s => __importStar(require(s))).then((route) => {
                app.use("/", route.default);
            }).catch((err) => {
                console.error(`Failed to load route ${fullPath}:`, err);
            });
        }
    }
}
loadRoutesRecursively(routesPath);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
