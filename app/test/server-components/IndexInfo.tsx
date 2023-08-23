'use client'

import { useEffect, useState } from "react"

interface DetailedIndexInformationResponse {
  'index': string
  'docs' : string
  'storeSize': string
  'mapping': string
  'sampleDocument': string
}
const DefaultDetailedIndexInformationResponse : DetailedIndexInformationResponse = {
  index: 'indexName',
  docs: '0',
  storeSize: '0gb',
  mapping: '{"mapping": "not found"}',
  sampleDocument: '{"sampleDocument": "not found"}'
}

export default function IndexInfo() {

  const [indexInfo, setIndexInfo] = useState<DetailedIndexInformationResponse>(DefaultDetailedIndexInformationResponse)
  const [value, setValue] = useState<number>(0)
  function toggleValue() {
    if (value === 0) {
      setValue(1)
    } else {
      setValue(0)
    }
  }

  useEffect(() => {
    async function fetchDetailedInfo() {
      const response = await fetch('/api/index-information/detailed-index-info', {
        method: 'POST',
        body: JSON.stringify({ index: 'performance_test' }),
        cache: 'no-store'
      })
      if(response.status !== 200 ) {
        console.log('error fetching detailed index info')
        return
      }
      try {
        const data = await response.json()
        setIndexInfo(data)
      } catch (error) {
        console.log('error parsing json')
        setIndexInfo(DefaultDetailedIndexInformationResponse)
        return
      }
    }
    fetchDetailedInfo()
  }, [value])

  return (
    <div
      className="p-5 w-full bg-slate-900"
    >
      <button
        className='text-green-500 hover:text-green-300'
        onClick={toggleValue}
      >
        refresh
      </button>

      <table
        className="table-auto w-full"
      >
        <thead>
          <tr>
            <th>index info</th>
            <th>Mapping</th>
            <th>Sample Document</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="table-auto w-1/3">
              <table
                className="table-auto w-full"
              >
                <thead>
                  <tr>
                    <th>index</th>
                    <th>docs</th>
                    <th>store size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{indexInfo.index}</td>
                    <td>{indexInfo.docs}</td>
                    <td>{indexInfo.storeSize}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="table-auto w-1/3">
              <pre>
                {JSON.stringify(JSON.parse(indexInfo.mapping), null, 2)}
              </pre>
            </td>
            <td className="table-auto w-1/3">
              <pre>
                {JSON.stringify(JSON.parse(indexInfo.sampleDocument), null, 2)}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

}

