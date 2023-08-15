import CpuInfo from "./server-components/CpuInfo";
import IndexInfo from "./server-components/IndexInfo";

export default function TestPage() {
  return (
    <div
      className="w-screen h-screen"
    >
      <div
        className="w-full flex flex-row"
      >
        <div
          className="w-10/12 m-5"
        >
          <IndexInfo />
        </div>
        <div
          className="w-2/12 m-5"
        >
          <CpuInfo />
        </div>
      </div>


    </div>
  )
}