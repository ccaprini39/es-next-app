'use server'

import { NextResponse } from "next/server"

export async function POST( request : Request ) {
  let response : object = {}

  const { method, headers, body } = request

  if ( method === 'POST' ) {
    const { url, options } = JSON.parse( body )

    response = await fetch( url, options )
  }

}

