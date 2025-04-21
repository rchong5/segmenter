export interface Staff
{
  _id: string;
  name: string;
}





export interface Project
{
  _id: string;
  name: string;
  annotated: number;
  imgs: string[];
}





export interface Img
{
  _id: string;
  URL: string;
  annotations: string[];
}