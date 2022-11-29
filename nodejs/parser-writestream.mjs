import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { uniqueIdGenerator } from './unique-generator.mjs'

/**
 * Parse an NDJSON file, and return a vector of parsed objects.
 */
function parseNDJSONToFile(inputFileURL, outputFileURL) {
  const rl = createInterface({
    input: createReadStream(fileURLToPath(inputFileURL)),
    output: createWriteStream(fileURLToPath(outputFileURL), { mode: 0o755, encoding: 'utf-8', autoClose: true }),
    crlfDelay: Infinity,
  })

  const getUniqueId = uniqueIdGenerator()

  return new Promise((resolve, reject) => {
    rl.on('line', line => {
      const start = process.hrtime.bigint()
      const lineData = JSON.parse(line)
      // console.log('DES', Number(process.hrtime.bigint() - start) / 1e3)
      const entry = {
        id: getUniqueId(),
        score: Math.random() * 0.5,
        document: { name: lineData.name, matter: lineData?.casebody?.data?.head_matter }
      }
      rl.output.write(`${JSON.stringify(entry)}\n`)
    })

    rl.on('error', reject)

    rl.on('close', resolve)
  })
}

async function main() {
  const inputFileURL = new URL('../data/data.jsonl', import.meta.url)
  const outputFileURL = new URL('../data/output/parsed-js.json', import.meta.url)
  await parseNDJSONToFile(inputFileURL, outputFileURL)
}

main()
  .catch(err => console.error(err))
