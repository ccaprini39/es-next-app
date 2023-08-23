'use client'

import { useEffect, useState } from "react"

interface IndexInformation {
  'index': string
  'docs.count': string
  'store.size': string
  'mapping': string
}


export default function IndicesPage() {

  const [indexList, setIndexList] = useState<IndexInformation[]>([])
  const [curr, setCurr] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [value, setValue] = useState<number>(0)
  function toggleValue() {
    if (value === 0) {
      setValue(1)
    } else {
      setValue(0)
    }
  }

  useEffect(() => {
    //the initial fetch to get the list of indices
    async function fetchIndexInformation() {
      setLoading(true)
      const response = await fetch('/api/index-information', {
        method: 'POST',
        cache: 'no-store'
      }
      )
      const data = await response.json()
      setIndexList(data)
      setLoading(false)
    }
    fetchIndexInformation()
  }, [value])

  async function handleDeleteAllIndices() {
    console.log('deleting all indices')
    const response = await fetch('/api/index/delete-all-indices',
      {
        method: 'GET',
        cache: 'no-store'
      })
    const data = await response.json()
    console.log(data)
    toggleValue()
  }

  async function handleIndex1000000Docs() {
    for await (const item of Array(8000).keys()) {
      //now I want to set the current index 
      setCurr(item)
      await handleIndex1000Docs()
    }
    setCurr(0)
    toggleValue()
  }

  async function handleIndex1000Docs() {
    const response = await fetch('/api/generator',
      {
        method: 'GET',
        cache: 'no-store'
      })
    const data = await response.json()
    const items = data.items
    const errors = []
    for (const item of items) {
      const result = item.index.result
      if (result !== 'created') {
        errors.push(item)
      }
    }
  }

  async function handleDeleteAllDocsInIndex() {
    await fetch('/api/index/delete-docs-in-index', {
      method: 'POST',
      body: JSON.stringify({ index: 'performance_test' }),
      cache: 'no-store'
    })
    toggleValue()
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div
      className="m-5"
    >
      <IndexListView indexList={indexList} />
      <button
        className="m-5 border text-sm 
        border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 
        hover:text-white transition-colors duration-300"
        onClick={handleDeleteAllIndices}
      >
        Delete All Indices
      </button>
      <button
        className="m-5 border text-sm
        border-yellow-500 text-yellow-500 px-4 py-2 rounded-full hover:bg-yellow-500
        hover:text-white transition-colors duration-300"
        onClick={handleDeleteAllDocsInIndex}
      >
        Delete All Docs In Index
      </button>
      {curr}
      <button
        className="m-5 border text-sm
        border-green-500 text-green-500 px-4 py-2 rounded-full hover:bg-green-500
        hover:text-white transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={curr !== 0}
        onClick={handleIndex1000000Docs}
      >
        Index 1 Million Docs
      </button>
      <CreateIndexForm toggleFunction={toggleValue} />
    </div>
  )
}

function IndexListView({ indexList }: { indexList: IndexInformation[] }) {
  return (
    <div>
      <h1>Index List</h1>
      <table
        className="table table-striped w-full bg-slate-600"
      >
        <thead>
          <tr>
            <th>Index</th>
            <th>Document Count</th>
            <th>Store Size</th>
            <th>Mapping</th>
          </tr>
        </thead>
        <tbody>
          {indexList.map((index, i) => {
            const odd = i % 2 === 0
            const className = "table-row " + (odd ? " bg-slate-500" : " bg-slate-400")
            return (
              <tr
                className={className}
                key={index.index}
              >
                <td
                  className="table-cell"
                >
                  {index.index}
                </td>
                <td
                  className="table-cell "
                >
                  {index['docs.count']}
                </td>
                <td
                  className="table-cell"
                >
                  {index['store.size']}
                </td>
                <td
                  className="table-cell"
                >
                  <pre>
                    {JSON.stringify(JSON.parse(index.mapping), null, 2)}
                  </pre>
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
    </div>
  )
}

function CreateIndexForm({ toggleFunction }: { toggleFunction: () => void }) {
  const [indexName, setIndexName] = useState<string>('')
  const [mapping, setMapping] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  async function handleCreateIndex() {
    const response = await fetch('/api/index/create-index',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          indexName: indexName,
          mapping: JSON.parse(mapping)
        }),
        cache: 'no-cache'
      })
    const data = await response.json()
    toggleFunction()
  }
  function handleVisibleToggle() {
    setVisible(!visible)
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
    toggleFunction()
  }

  if (!visible) {
    return (
      <div
        className="m-5 flex flex-col w-full"
      >
        <button
          className="m-5 border text-sm"
          onClick={handleVisibleToggle}
        >Create Index</button>
      </div>
    )
  }

  return (
    <div
      className="m-5 flex flex-col w-full"
    >

      <button
        className="m-5 border text-sm"
        onClick={handleVisibleToggle}
      >hide Create Index</button>
      <button
        className="m-5 border text-sm"
        onClick={handleCreateTestingIndex}
      >Create Testing Index</button>
      <div
        className="flex flex-row"
      >
        <label
          htmlFor="indexName"
          className="w-1/6"
        >
          Index Name
        </label>
        <input
          className="border border-gray-500 rounded-lg p-2 m-2 w-5/6 text-black"
          type="text"
          id="indexName"
          value={indexName}
          onChange={(e) => setIndexName(e.target.value)}
        />
      </div>
      <div
        className="flex flex-row"
      >
        <label
          htmlFor="mapping"
          className="w-1/6"
        >
          Mapping
        </label>
        <textarea
          className="border border-gray-500 rounded-lg p-2 m-2 w-5/6 text-black"
          id="mapping"
          value={mapping}
          onChange={(e) => setMapping(e.target.value)}
        />
      </div>
      <button
        className="m-5 border text-sm 
        border-green-500 text-green-500 px-4 py-2 rounded-full hover:bg-green-500 
        hover:text-white transition-colors duration-300"
        onClick={handleCreateIndex}
      >
        Create Index
      </button>
    </div>
  )
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}