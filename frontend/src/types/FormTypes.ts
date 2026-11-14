import type { IconType } from "react-icons";

export interface RegFormTypes {
    name : string,
    email : string,
    password : string
}


export interface LoginFromTypes {
    email :string,
    password : string
}

export interface loginDataTypes {
  id: string;
  Icon: IconType;
  title: string;
  decsriptions: string;
}
