"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function AuthSubmitButton({children}:{children:React.ReactNode}){const{pending}=useFormStatus();return <Button className="mt-6 w-full" disabled={pending} aria-disabled={pending}>{pending&&<Loader2 className="mr-2 size-4 animate-spin"/>}{pending?"Đang xử lý...":children}</Button>}
