import React from "react";
import { AuxProps } from "../../types/commonTypes";
import style from "./paper.module.css";

const Paper = ({ children }: AuxProps) => {
  return <div className={style.paper}>{children}</div>;
};

export default Paper;
