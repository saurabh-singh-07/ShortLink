import { FaStar } from "react-icons/fa";
import type { heroDataTypes } from "../types/heroTypes";
import { GrSecure } from "react-icons/gr";
import { CgTrack } from "react-icons/cg";
import { BiMobile } from "react-icons/bi";


export const heroData : heroDataTypes[] = [
    {
        id : '1',
        Icon : FaStar,
        name : "Fast & Reliable",
        descriptions : "Lightning quick link redirection, 99.9 % uptime."
    },{
        id : "2",
        Icon : GrSecure,
        name : "Secure",
        descriptions : 'Your links are safe and protected.',

    },{
        id : "3",
        Icon : CgTrack,
        name : "Track Performance",
        descriptions : "Real-time analytics to measure your success."
    },{
        id : "4",
        Icon : BiMobile,
        name : "Works Everywhere",
        descriptions : "Access your links from any device, anytime."
    }
]