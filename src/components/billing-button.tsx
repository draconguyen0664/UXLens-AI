"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function BillingButton({kind="checkout",children,className}:{kind?:"checkout"|"portal";children:React.ReactNode;className?:string}){const[loading,setLoading]=useState(false);async function run(){setLoading(true);try{const response=await fetch(`/api/billing/${kind}`,{method:"POST"});const payload=await response.json();if(!response.ok)throw new Error(payload.error);window.location.assign(payload.url)}catch(error){alert(error instanceof Error?error.message:"Không thể mở thanh toán");setLoading(false)}}return <Button className={className} onClick={()=>void run()} disabled={loading}>{loading&&<Loader2 className="mr-2 size-4 animate-spin"/>}{children}</Button>}
