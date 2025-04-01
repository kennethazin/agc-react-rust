import DSKY from "./DSKY";
import GuidancePanel from "./GuidancePanel";
import SolarSystem from "@/components/SolarSystem";
export default function Home() {
  return (
    <>
      <div className="absolute text-white h-screen w-screen z-0">
        <SolarSystem />
      </div>
      <div className=" w-full flex  flex-row items-end  min-h-screen bg-black">
        <div className=" w-full flex items-center justify-between gap-0 p-2 ">
          <div className="w-[350px] h-[470px] shadow-sm z-20">
            <DSKY />
          </div>
          <div className="h-full  shadow-sm bg-gray-300  rounded-sm py-1 z-50">
            <GuidancePanel />
          </div>
        </div>
      </div>
    </>
  );
}
