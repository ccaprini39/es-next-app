'use client'

import { useEffect, useState } from "react"
import Loading from "../loading"

export default function PerformanceTestPage() {

  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<string[]>(['Starting test...'])

  useEffect(() => {
    async function indexNDocs(n: number) {
      await fetch('/api/generator', {
        method: 'POST',
        body: JSON.stringify({ n: n }),
        cache: 'no-store'
      })
    }

    async function runNQueriesGetNTooks(n: number) {
      const requestBody = JSON.stringify({
        index: 'performance_test',
        warmup: false,
        numOfQueries: n
      })
      const response = await fetch('/api/generator/query-generator', {
        method: 'POST',
        body: requestBody,
        cache: 'no-store'
      })
      const data = await response.json()
      return data.averageTook
    }

    async function getCpuAndMemory() {
      const response = await fetch('/api/infrastructure-information', {
        method: 'POST',
        cache: 'no-store'
      })
      const data = await response.json()
      return data
    }

    async function deleteAllIndices() {
      await fetch('/api/index/delete-all-indices',
        {
          method: 'GET',
          cache: 'no-store'
        })
    }

    async function handleCreateTestingIndex(){
      const indexName = 'performance_test'
      const mapping = {
        "mappings": {
          "properties": {
            "dob": {
              "type": "rni_date",
              "format": "yyyyMMdd"
            },
            "name": {
              "type": "rni_name"
            },
            "ucn": {
              "type": "keyword"
            }
          }
        }
      }
      const response = await fetch('/api/index/create-index',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            indexName: indexName,
            mapping: mapping
          }),
          cache: 'no-cache'
        })
      const data = await response.json()
    }

    async function runQueries(numOfDocs: number) {
      setResults(previousResults => [...previousResults, 'running 100 queries and saving the took times'])
      const run100QueriesStart = performance.now()
      const tookTimes100Queries = await runNQueriesGetNTooks(100)
      const run100QueriesEnd = performance.now()
      setResults(previousResults => [...previousResults, `Average took time for ${numOfDocs} documents is ${tookTimes100Queries} milliseconds`])
      setResults(previousResults => [...previousResults, `running 100 queries and saving the took times took ${run100QueriesEnd - run100QueriesStart} milliseconds`])
    }

    async function runFullTest() {

      //first delete all indices
      setResults(previousResults => [...previousResults, 'deleting all indices'])
      const deleteAllIndicesStart = performance.now()
      await deleteAllIndices()
      const deleteAllIndicesEnd = performance.now()
      setResults(previousResults => [...previousResults, `deleting all indices took ${deleteAllIndicesEnd - deleteAllIndicesStart} milliseconds`,""])

      //now create the testing index
      setResults(previousResults => [...previousResults, 'creating performance_test index',""])
      const createTestingIndexStart = performance.now()
      await handleCreateTestingIndex()
      const createTestingIndexEnd = performance.now()
      setResults(previousResults => [...previousResults, `creating performance_test index took ${createTestingIndexEnd - createTestingIndexStart} milliseconds`,""])

      //we want the total to be 10 documents, so we need to index 10 documents
      setResults(previousResults => [...previousResults, 'indexing 10 documents'])
      const index10DocsStart = performance.now()
      await indexNDocs(10)
      const index10DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing 10 documents took ${index10DocsEnd - index10DocsStart} milliseconds`,""])

      //now we want to run 100 queries and save the took times
      await runQueries(10)

      //we want the total to be 100 documents, so we need to index 90 documents
      setResults(previousResults => [...previousResults, 'indexing to 100 documents'])
      const index90DocsStart = performance.now()
      await indexNDocs(90)
      const index90DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 100 documents took ${index90DocsEnd - index90DocsStart} milliseconds`,""])
      await runQueries(100)

      //we want the total to be 1000 documents, so we need to index 900 documents
      setResults(previousResults => [...previousResults, 'indexing to 1k documents'])
      const index900DocsStart = performance.now()
      await indexNDocs(900)
      const index900DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 1k documents took ${index900DocsEnd - index900DocsStart} milliseconds`,""])
      await runQueries(1000)

      //we want the total to be 10000 documents, so we need to index 9000 documents
      setResults(previousResults => [...previousResults, 'indexing to 10k documents'])
      const index9000DocsStart = performance.now()
      await indexNDocs(9000)
      const index9000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 10k documents took ${index9000DocsEnd - index9000DocsStart} milliseconds`,""])
      await runQueries(10000)

      //we want the total to be 100000 documents, so we need to index 90000 documents
      setResults(previousResults => [...previousResults, 'indexing to 100k documents'])
      const index90000DocsStart = performance.now()
      await indexNDocs(90000)
      const index90000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 100k documents took ${index90000DocsEnd - index90000DocsStart} milliseconds`,""])
      await runQueries(100000)

      //we want the total to be 1000000 documents, so we need to index 900000 documents
      setResults(previousResults => [...previousResults, 'indexing to 1m documents'])
      const index900000DocsStart = performance.now()
      await indexNDocs(900000)
      const index900000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 1m documents took ${index900000DocsEnd - index900000DocsStart} milliseconds`,""])
      await runQueries(1000000)

      //we want the total to be 2000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 2m documents'])
      const index1000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index1000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 2m documents took ${index1000000DocsEnd - index1000000DocsStart} milliseconds`,""])
      await runQueries(2000000)

      //we want the total to be 3000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 3m documents'])
      const index2000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index2000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 3m documents took ${index2000000DocsEnd - index2000000DocsStart} milliseconds`,""])
      await runQueries(3000000)

      //we want the total to be 4000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 4m documents'])
      const index3000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index3000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 4m documents took ${index3000000DocsEnd - index3000000DocsStart} milliseconds`,""])
      await runQueries(4000000)

      //we want the total to be 5000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 5m documents'])
      const index4000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index4000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 5m documents took ${index4000000DocsEnd - index4000000DocsStart} milliseconds`,""])
      await runQueries(5000000)

      //we want the total to be 6000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 6m documents'])
      const index5000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index5000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 6m documents took ${index5000000DocsEnd - index5000000DocsStart} milliseconds`,""])
      await runQueries(6000000)

      //we want the total to be 7000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 7m documents'])
      const index6000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index6000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 7m documents took ${index6000000DocsEnd - index6000000DocsStart} milliseconds`,""])
      await runQueries(7000000)

      //we want the total to be 8000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 8m documents'])
      const index7000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index7000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 8m documents took ${index7000000DocsEnd - index7000000DocsStart} milliseconds` ,""])
      await runQueries(8000000)

      //we want the total to be 9000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 9m documents'])
      const index8000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index8000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 9m documents took ${index8000000DocsEnd - index8000000DocsStart} milliseconds`,""])
      await runQueries(9000000)

      //we want the total to be 10000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 10m documents'])
      const index9000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index9000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 10m documents took ${index9000000DocsEnd - index9000000DocsStart} milliseconds`,""])
      await runQueries(10000000)

      //we want the total to be 11000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 11m documents'])
      const index10000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index10000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 11m documents took ${index10000000DocsEnd - index10000000DocsStart} milliseconds`,""])
      await runQueries(11000000)

      //we want the total to be 12000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 12m documents'])
      const index11000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index11000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 12m documents took ${index11000000DocsEnd - index11000000DocsStart} milliseconds`,""])
      await runQueries(12000000)

      //we want the total to be 13000000 documents, so we need to index 1000000 documents
      setResults(previousResults => [...previousResults, 'indexing to 13m documents'])
      const index12000000DocsStart = performance.now()
      await indexNDocs(1000000)
      const index12000000DocsEnd = performance.now()
      setResults(previousResults => [...previousResults, `indexing to 13m documents took ${index12000000DocsEnd - index12000000DocsStart} milliseconds`,""])
      await runQueries(13000000)

    }
    runFullTest()
  }, [])



  if (loading) return <Loading />
  return (
    <div
      className='w-screen h-screen p-5'
    >
      <h1>Performance Test</h1>
      <div className='flex flex-col'>
        {results.map((result, index) => {
          if(result === '') return <br key={index}/>
          return (
            <div key={index}>
              {result}
            </div>
          )})
        }
      </div>
    </div>
  )
}

/* 
  here is what this must do
  1. save the information about the infrastructure state at the beginning of the test
  -- this will include number of shards, memory, cpu, etc
  2. index 10 documents, run 100 queries and save the took times
  -- this will include the number of shards, memory, cpu, etc
  3. index to 100 total documents, run 100 queries and save the took times. 
  4. index to 1000 total documents, run 100 queries and save the took times
  5. index to 10000 total documents, run 100 queries and save the took times
  6. index to 100000 total documents, run 100 queries and save the took times
  7. index to 1000000 total documents, run 100 queries and save the took times
  8. index to 10000000 total documents, run 100 queries and save the took times
  9. index to 2 million total documents, run 100 queries and save the took times
  10. index to 3 million total documents, run 100 queries and save the took times
  11. index to 4 million total documents, run 100 queries and save the took times
  12. index to 5 million total documents, run 100 queries and save the took times
  13. index to 6 million total documents, run 100 queries and save the took times
  14. index to 7 million total documents, run 100 queries and save the took times
  15. index to 8 million total documents, run 100 queries and save the took times
  16. index to 9 million total documents, run 100 queries and save the took times
  17. index to 10 million total documents, run 100 queries and save the took times
  18. index to 11 million total documents, run 100 queries and save the took times
  19. index to 12 million total documents, run 100 queries and save the took times
  20. index to 13 million total documents, run 100 queries and save the took times
  21. index to 14 million total documents, run 100 queries and save the took times
  22. index to 15 million total documents, run 100 queries and save the took times
  23. index to 16 million total documents, run 100 queries and save the took times
  24. index to 17 million total documents, run 100 queries and save the took times
  25. index to 18 million total documents, run 100 queries and save the took times
  26. index to 19 million total documents, run 100 queries and save the took times
  27. index to 20 million total documents, run 100 queries and save the took times

*/