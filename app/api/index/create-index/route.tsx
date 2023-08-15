//endpoint that takes a mapping and creates an index

import { NextResponse } from "next/server"

export async function POST ( request: Request ) {
  const body = await request.json() as IndexCreateObject

  const indexName = body.indexName
  const mapping = body.mapping

  const response = await fetch( 'https://localhost:9200/' + indexName, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Basic ' + process.env.ES_AUTH
    },
    body: JSON.stringify( mapping ),
    cache: 'no-cache'
  } )

  const data = await response.json()
  return NextResponse.json( data )
}

export interface IndexCreateObject {
  indexName: string
  mapping: object
}

const sampleMappingEsTypes = {
  "mappings": {
    "properties": {
      "dob": {
        "type": "date",
        "format": "yyyyMMdd"
      },
      "name": {
        "type": "text"
      },
      "ucn": {
        "type": "keyword"
      }
    }
  }
}

const sampleMappingRniTypes = {
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