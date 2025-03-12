"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface AgcState {
  connected: boolean;
  displayDigits: string[];
  verb: string;
  noun: string;
  prog: string;
  compActivity: boolean;
  statusFlags: {
    uplinkActy: boolean;
    temp: boolean;
    noAtt: boolean;
    gimbalLock: boolean;
    stby: boolean;
    prog: boolean;
    keyRel: boolean;
    restart: boolean;
    oprErr: boolean;
    tracker: boolean;
  };
}

interface AgcContextType {
  agcState: AgcState;
  sendKeypress: (key: string) => void;
  reconnect: () => void;
}

// define initial state of agc
const initialState: AgcState = {
  connected: false,
  displayDigits: ["00000", "00000", "00000"],
  verb: "00",
  noun: "00",
  prog: "00",
  compActivity: false,
  statusFlags: {
    uplinkActy: false,
    temp: false,
    noAtt: false,
    gimbalLock: false,
    stby: false,
    prog: false,
    keyRel: false,
    restart: false,
    oprErr: false,
    tracker: false,
  },
};

// create context
const AgcContext = createContext<AgcContextType>({
  agcState: initialState,
  sendKeypress: () => {},
  reconnect: () => {},
});

// TODO can only continue once the RUST emulation can succesffuly use the ROM.

// helper to parse binary data from the AGC

// helper to create binary packet to the AGC


