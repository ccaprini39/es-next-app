import { NextResponse } from "next/server"

/**
 * Function that gets the basic ES server status
 * @returns 
 */
export async function POST( request: Request ) {
  //now lets get the list of indices
  const url = 'https://localhost:9200/_cat/indices?format=json&pretty=true&h=index,docs.count,store.size&bytes=b'

  const response = await fetch( url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    cache: 'no-store'
  } )

  //
  let data = await response.json()
  let withMappings : IndexInformation[] = []
  //now I need to get the mapping for each index
  for await ( const index of data ){
    const mappingResponse = await fetch( 'https://localhost:9200/' + index.index + '/_mapping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Basic ' + process.env.ES_AUTH
      },
      cache: 'no-store'
    } )
    const mappingData = await mappingResponse.json()
    const mapping = mappingData[ index.index ].mappings
    withMappings.push( {
      ...index,
      mapping: JSON.stringify( mapping, null, 2 )
    } )
  }

  return NextResponse.json( withMappings )
}

interface IndexInformation {
  'index': string
  'docs.count': string
  'store.size': string
  'mapping': string
}