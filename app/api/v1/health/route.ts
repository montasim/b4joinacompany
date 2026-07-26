import { NextResponse } from "next/server";
import { datasetStats } from "@/lib/research";
export async function GET(){return NextResponse.json({ok:true,service:"b4joinacompany-research-api",version:"v1",dataset:await datasetStats(),providers:{gemini:Boolean(process.env.GEMINI_API_KEY),groq:Boolean(process.env.GROQ_API_KEY),deterministic:true}})}
