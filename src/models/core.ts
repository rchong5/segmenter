export interface Staff
{
  _id: string;
  name: string;
  projects: string[];
  imgs: string[];
  annotations: string[];
}





export interface Project
{
  _id: string;
  name: string;
  annotated: number;
  annotators: string[];
  imgs: string[];
  annotations: string[];
}





export interface Img
{
  _id: string;
  URL: string;
  projects: string[];
  annotators: string[];
  annotations: string[];
}





export interface Annotation
{
  _id: string;
  annotators: string[];
  img: string;
  projects: string[];
  label: string;
  area: number;
  points: number[];
}