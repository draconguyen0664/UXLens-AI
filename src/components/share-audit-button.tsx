"use client";
import { useState } from "react";
import { Check,Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ShareAuditButton({auditId}:{auditId:string}){const[copied,setCopied]=useState(false);async function share(){if(auditId==="demo"){alert("Hãy tạo audit thật để bật link chia sẻ.");return}const response=await fetch(`/api/audits/${auditId}/share`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({isPublic:true})});const data=await response.json();if(!response.ok){alert(data.error);return}await navigator.clipboard.writeText(data.url);setCopied(true);setTimeout(()=>setCopied(false),2000)}return <Button variant="outline" onClick={()=>void share()}>{copied?<Check className="mr-2 size-4"/>:<Share2 className="mr-2 size-4"/>}{copied?"Đã copy":"Share"}</Button>}
