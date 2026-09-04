import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
export const runtime="nodejs";
function mappedStatus(status:Stripe.Subscription.Status){"use strict";if(status==="active"||status==="trialing"||status==="past_due"||status==="incomplete")return status;if(status==="canceled")return "canceled";return "expired"}
async function syncSubscription(subscription:Stripe.Subscription){
 const userId=subscription.metadata.userId;if(!userId)throw new Error("Subscription thiếu userId metadata");
 const item=subscription.items.data[0];const periodEnd=item?.current_period_end?new Date(item.current_period_end*1000).toISOString():null;
 const customer=typeof subscription.customer==="string"?subscription.customer:subscription.customer.id;
 const admin=createAdminClient();const{error}=await admin.from("subscriptions").upsert({user_id:userId,provider:"stripe",provider_customer_id:customer,provider_subscription_id:subscription.id,status:mappedStatus(subscription.status),plan:"pro",current_period_end:periodEnd,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(error)throw error;
}
export async function POST(request:Request){
 const signature=request.headers.get("stripe-signature");const secret=process.env.STRIPE_WEBHOOK_SECRET;if(!signature||!secret)return NextResponse.json({error:"Webhook chưa được cấu hình"},{status:400});
 let event:Stripe.Event;try{event=getStripe().webhooks.constructEvent(await request.text(),signature,secret)}catch{return NextResponse.json({error:"Invalid signature"},{status:400})}
 const admin=createAdminClient();const{error:claimError}=await admin.from("payment_events").insert({provider:"stripe",provider_event_id:event.id,event_type:event.type,payload:event as unknown as Record<string,unknown>});
 if(claimError?.code==="23505")return NextResponse.json({received:true,duplicate:true});if(claimError)return NextResponse.json({error:claimError.message},{status:500});
 try{if(event.type==="customer.subscription.created"||event.type==="customer.subscription.updated"||event.type==="customer.subscription.deleted")await syncSubscription(event.data.object);await admin.from("payment_events").update({processed_at:new Date().toISOString()}).eq("provider_event_id",event.id);return NextResponse.json({received:true})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Webhook failed"},{status:500})}
}
