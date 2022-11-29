import { createReadStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { uniqueIdGenerator } from './unique-generator.mjs'

/**
 * Parse an NDJSON file, and return a vector of parsed objects.
 */
function parseNDJSON(inputFileURL) {
  const rl = createInterface({
    input: createReadStream(fileURLToPath(inputFileURL)),
    crlfDelay: Infinity,
  })

  const getUniqueId = uniqueIdGenerator()
  const data = []

  return new Promise((resolve, reject) => {
    rl.on('line', line => {
      const start = process.hrtime.bigint()
      const lineData = JSON.parse(line)
      // console.log('DES', Number(process.hrtime.bigint() - start) / 1e3)
      data.push({
        id: getUniqueId(),
        score: Math.random() * 0.5,
        document: { name: lineData.name, matter: lineData?.casebody?.data?.head_matter }
      })
    })

    rl.on('error', reject)

    rl.on('close', () => {
      resolve(data)
    })
  })
}

async function parseNDJSONToFile(inputFileURL, outputFileURL) {
  const data = await parseNDJSON(inputFileURL)
  await writeFile(fileURLToPath(outputFileURL), JSON.stringify(data), 'utf-8') 
}

async function main() {
  const inputFileURL = new URL('../data/data.jsonl', import.meta.url)
  const outputFileURL = new URL('../data/output/parsed-js.json', import.meta.url)
  await parseNDJSONToFile(inputFileURL, outputFileURL)
}

main()
  .catch(err => console.error(err))
