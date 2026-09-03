import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";
export async function createClient() { const store=await cookies(); const {url,anonKey}=getSupabasePublicConfig(); return createServerClient(url,anonKey,{cookies:{getAll:()=>store.getAll(),setAll:(items:Parameters<NonNullable<CookieMethodsServer["setAll"]>>[0])=>{try{items.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}}); }