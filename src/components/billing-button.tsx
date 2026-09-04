"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics";
export function BillingButton({kind="checkout",children,className,disabledReason}:{kind?:"checkout"|"portal";children:React.ReactNode;className?:string;disabledReason?:string}){const[loading,setLoading]=useState(false);async function run(){capture("upgrade_clicked",{source:kind});if(disabledReason){toast.info(disabledReason);return}setLoading(true);try{const response=await fetch(`/api/billing/${kind}`,{method:"POST"});const payload=await response.json();if(!response.ok)throw new Error(payload.error);if(kind==="checkout")capture("checkout_started");window.location.assign(payload.url)}catch(error){toast.error(error instanceof Error?error.message:"Không thể mở thanh toán");setLoading(false)}}return <Button className={className} onClick={()=>void run()} disabled={loading}>{loading&&<Loader2 className="mr-2 size-4 animate-spin"/>}{children}</Button>}
