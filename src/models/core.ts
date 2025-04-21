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





export interface Annotation
{
  _id: string;
  annotators: string[];
  label: string;
  area: number;
  points: number[];
}