import React from "react";
import DSKYButton from "./components/DSKYButton";
import DSKYStatusPanel from "./components/DSKYStatusPanel";
import DSKYNumericPanel from "./components/DSKYNumericPanel";

const DSKY = () => {
  return (
    <div className="bg-gray-300 w-[350px] h-[400px] p-1 flex flex-col text-center font-mono rounded-sm ">
      <div className="flex flex-row justify-evenly m-2 h-3/5 mx-4 gap-2 ">
        <div className="w-full mx-0 grid grid-cols-2 grid-rows-7 gap-1 rounded-md border-4 border-b-gray-400 border-l-gray-200  border-r-gray-400 shadow-xs   ">
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
        <div className="w-full mx-0 grid grid-cols-2 grid-rows-7 gap-1 pt-4 rounded-md border-4 border-b-gray-400 border-l-gray-200 border-r-gray-400 shadow-xs bg-green-950/30  shadow-[inset_5px_5px_2.5px_rgba(0.2,0.2,0.2,0.2)] ">
          <DSKYNumericPanel label="COMP ACTY" />
          <DSKYNumericPanel label="PROG" />
          <DSKYNumericPanel label="VERB" />
          <DSKYNumericPanel label="NOUN" />
        </div>
      </div>
      <div className=" h-2/5 my-1 flex flex-row justify-evenly items-center text-center uppercase">
        <div className=" flex flex-col justify-evenly text-xs gap-1 cap">
          <DSKYButton variant="text">verb</DSKYButton>
          <DSKYButton variant="text">noun</DSKYButton>
        </div>
        <div className="h-full grid grid-cols-5 grid-rows-3  gap-x-[0.25rem] ">
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
