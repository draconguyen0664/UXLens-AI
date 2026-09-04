import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl,getStripe } from "@/lib/stripe";
export async function POST(){
 try{const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const price=process.env.STRIPE_PRO_PRICE_ID;if(!price)return NextResponse.json({error:"Thiếu STRIPE_PRO_PRICE_ID"},{status:503});
 const{data:existing}=await supabase.from("subscriptions").select("provider_customer_id").eq("user_id",user.id).maybeSingle();
 const stripe=getStripe();let customer=existing?.provider_customer_id??undefined;
 if(!customer){const created=await stripe.customers.create({email:user.email,metadata:{userId:user.id}});customer=created.id}
 const session=await stripe.checkout.sessions.create({mode:"subscription",customer,line_items:[{price,quantity:1}],client_reference_id:user.id,metadata:{userId:user.id},subscription_data:{metadata:{userId:user.id}},success_url:`${getAppUrl()}/dashboard/billing?checkout=complete`,cancel_url:`${getAppUrl()}/pricing?checkout=canceled`,allow_promotion_codes:true});
 if(!session.url)throw new Error("Stripe không trả về checkout URL");return NextResponse.json({url:session.url});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Không thể tạo checkout"},{status:500})}
}
