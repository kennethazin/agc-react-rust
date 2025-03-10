import React from "react";
import DSKYButton from "./components/DSKYButton";
import DSKYStatusPanel from "./components/DSKYStatusPanel";
import DSKYNumericPanel from "./components/DSKYNumericPanel";

const DSKY = () => {
  return (
    <div className="bg-gray-200 w-[350px] h-[450px] p-1 flex flex-col text-center font-mono rounded-sm ">
      <div className="flex flex-row justify-evenly m-2 h-3/5 mx-4 gap-2 ">
        <div className="w-full h-full  border-[0.1rem] border-neutral-600  rounded-lg   ">
          <div className="w-full h-full mx-0 grid grid-cols-2 grid-rows-7 gap-1 rounded-md border-[0.3rem]  border-neutral-400 p-0.5 shadow-[inset_4px_-2px_5px_rgba(4,4,0,0.5)]  ">
            <DSKYStatusPanel label="UPLINK ACTY" isActive />
            <DSKYStatusPanel label="TEMP" />
            <DSKYStatusPanel label="NO ATT" />
            <DSKYStatusPanel label="GIMBAL LOCK" />
            <DSKYStatusPanel label="STBY" />
            <DSKYStatusPanel label="PROG" />
            <DSKYStatusPanel label="KEY REL" />
            <DSKYStatusPanel label="RESTART" />
            <DSKYStatusPanel label="OPR ERR" />
            <DSKYStatusPanel label="TRACKER" />
          </div>
        </div>
        <div className="w-full h-full border-[0.1rem] border-neutral-600  rounded-lg bg-black  ">
          <div className="relative w-full h-full mx-0  rounded-md border-[0.3rem]    border-neutral-400 p-0.5 shadow-[inset_4px_-2px_5px_rgba(4,4,0,0.5)]  bg-green-950/30   ">
            <div className="grid mb-1">
              <div className="text-xs uppercase  flex flex-row justify-between items-center ">
                <div className="  bg-green-400 w-2/5 h-full flex flex-col items-center justify-center rounded-sm ">
                  <div>comp</div>
                  <div>acty</div>
                </div>
                <div className="flex flex-col items-end   w-2/5 ">
                  <div className="bg-green-400 w-full rounded-sm text-xs">
                    prog
                  </div>
                  <div className="text-4xl ds-digital text-green-400">00</div>
                </div>
              </div>
            </div>
            <div className=" flex flex-row justify-between ">
              <div className=" bg-green-400 w-2/5 text-xs h-fit rounded-sm ">
                Verb
              </div>
              <div className=" bg-green-400 w-2/5 text-xs h-fit rounded-sm">
                Verb
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-4xl ds-digital text-green-400">00</div>
              <div className="text-4xl ds-digital text-green-400">00</div>
            </div>
            <div className="flex flex-col space-y-[-3px]">
              <div className="bg-green-300 h-[1px]" />
              <div className="text-4xl ds-digital text-green-400">+00000</div>
              <div className="bg-green-300 h-[1px]" />
              <div className="text-4xl ds-digital text-green-400">+00000</div>
              <div className="bg-green-300 h-[1px]" />
              <div className="text-4xl ds-digital text-green-400">+00000</div>
            </div>
          </div>
        </div>
      </div>
      <div className=" h-3/4 my-4 flex flex-row justify-evenly items-center text-center uppercase ">
        <div className=" flex flex-col justify-evenly text-xs gap-1 cap">
          <DSKYButton variant="text">verb</DSKYButton>
          <DSKYButton variant="text">noun</DSKYButton>
        </div>
        <div className="h-full grid grid-cols-5 grid-rows-3  gap-x-[0.2rem] gap-y-[0.2rem] ">
          <DSKYButton>+</DSKYButton>
          <DSKYButton>7</DSKYButton>
          <DSKYButton>8</DSKYButton>
          <DSKYButton>9</DSKYButton>
          <DSKYButton variant="text">CLR</DSKYButton>
          <DSKYButton>-</DSKYButton>
          <DSKYButton>4</DSKYButton>
          <DSKYButton>5</DSKYButton>
          <DSKYButton>6</DSKYButton>
          <DSKYButton variant="text">PRO</DSKYButton>
          <DSKYButton>0</DSKYButton>
          <DSKYButton>1</DSKYButton>
          <DSKYButton>2</DSKYButton>
          <DSKYButton>3</DSKYButton>
          <DSKYButton variant="text">KEY REL</DSKYButton>
        </div>
        <div className=" flex flex-col justify-evenly text-xs gap-1">
          <DSKYButton variant="text">enter</DSKYButton>
          <DSKYButton variant="text">reset</DSKYButton>
        </div>
      </div>
    </div>
  );
};

export default DSKY;
