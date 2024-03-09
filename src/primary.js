import cluster from "cluster"
import os from 'os'
import {dirname} from 'path'
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const cpuCount = os.cpus().length ;

console.log(`The total number of Cup is  : ${cpuCount}`)
console.log(`The Primary pid = ${process.pid}`)

cluster.setupPrimary({
                       exec :__dirname + "/index.js",
                    })

for(let i=0; i<cpuCount ; i++)
{
    cluster.fork()
}

cluster.on("exit", (worker, code, signal)=>{
                                            console.log(`worker ${worker.process.pid} has been killed`)
                                            console.log("Starting another worker")
                                            cluster.fork()
                                           }
          );

