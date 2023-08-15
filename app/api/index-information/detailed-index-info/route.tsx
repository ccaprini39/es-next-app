import { NextResponse } from "next/server"


export async function POST( request: Request ) {

  const body = await request.json() 
  //now lets get the list of indices
  const defaultBody : any = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-store'
  }
  
  const baseUrl = 'https://localhost:9200'
  let response : DetailedIndexInformationResponse = DefaultDetailedIndexInformationResponse

  const index = body.index
  const mappingUrl = baseUrl + '/' + index + '/_mapping?format=json'
  const mappingResponse = await fetch( mappingUrl, defaultBody )
  const mappingData = await mappingResponse.json()
  const mappingString = JSON.stringify(mappingData[ index ].mappings)

  const count = await fetch( baseUrl + '/' + index + '/_count?format=json', defaultBody )
  const countData = await count.json()

  const store = await fetch( baseUrl + '/' + index + '/_stats/store?format=json', defaultBody )
  const storeData = await store.json()
  const sizeInBytes = storeData.indices[ index ].total.store.size_in_bytes
  const sizeInGb = (sizeInBytes / 1024 / 1024 / 1024).toFixed(2) + 'gb'

  const randomDoc = await fetch( baseUrl + '/' + index + '/_search?size=1', defaultBody )
  const randomDocData = await randomDoc.json()
  const sampleDocument = randomDocData.hits.hits[0]._source
  const sampleDocumentString = JSON.stringify(sampleDocument, null, 2)

  response.index = index
  response.docs = countData.count
  response.storeSize = sizeInGb
  response.mapping = mappingString
  response.sampleDocument = sampleDocumentString
  

  return NextResponse.json( response )
}

export interface DetailedIndexInformationRequest {
  index: string
}



export interface DetailedIndexInformationResponse {
  'index': string
  'docs' : string
  'storeSize': string
  'mapping': string
  'sampleDocument': string
}

export const DefaultDetailedIndexInformationResponse : DetailedIndexInformationResponse = {
  index: 'indexName',
  docs: '0',
  storeSize: '0gb',
  mapping: '{"mapping": "not found"}',
  sampleDocument: '{"sampleDocument": "not found"}'
}

const sampleResult : DetailedIndexInformationResponse = {
  "index": "performance_test",
  "docs": "57",
  "storeSize": "1.1gb",
  "mapping": "{\n  \"properties\" : {\n    \"dob\" : {\n      \"type\" : \"date\",\n      \"format\" : \"yyyyMMdd\"\n    },\n    \"name\" : {\n      \"type\" : \"text\"\n    },\n    \"ucn\" : {\n      \"type\" : \"keyword\"\n    }\n  }\n}",
  "sampleDocument": "{\n  \"sampleDocument\" : \"not found\"\n}"
}