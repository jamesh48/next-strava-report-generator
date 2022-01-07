import { Response } from "express";

export const send400 = (res: Response, message: string) => {
  console.log(message);
  res.status(400).write(message);
};
export const send401 = (res: Response, message: string) => {
  console.log(message);
  res.status(401).send(message);
};

export const send429 = (res: Response, message: string) => {
  res.status(429).send(message);
}
export const send500 = (res: Response, message: string) => {
  res.status(500).send(message);
};
