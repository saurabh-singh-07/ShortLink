import { CgTrack } from "react-icons/cg";
import { FaStar } from "react-icons/fa";
import { GrSecure } from "react-icons/gr";
import type { loginDataTypes } from "../types/FormTypes";


export const loginData: loginDataTypes[]= [
  {
    id: "1",
    Icon: FaStar,
    title: "Fast",
    decsriptions: "Get short links in seconds",
  },
  {
    id: "2",
    Icon: GrSecure,
    title: "Secure",
    decsriptions: "your links our priority",
  },
  {
    id: "3",
    Icon: CgTrack,
    title: "Track",
    decsriptions: "Monitor clicks & performance",
  },
];
