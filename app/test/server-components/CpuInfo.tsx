'use client'

import { useEffect, useState } from "react"

export default function CpuInfo() {

  const [cpuInfo, setCpuInfo] = useState<any>('something')

  useEffect(() => {
    async function fetchCpuInfo() {
      const response = await fetch(
        '/api/index-information/node-cpu-info',
        {
          method: 'GET',
          cache: 'no-store'
        }
      )
      const data = await response.json()
      const percent = data.data
      setCpuInfo(percent)
    }
    async function fetchInfoEverySecond() {
      setInterval(() => {
        fetchCpuInfo()
      }, 1500)
    }
    fetchInfoEverySecond()
  }, [])

  return (
    <div
      className="p-5 w-full bg-slate-900"
    >
      Current CPU Usage:
      <h1
        className="text-2xl"
      >
        {cpuInfo}
      </h1>
    </div>
  )
}