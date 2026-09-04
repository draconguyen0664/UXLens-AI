import Stripe from "stripe";
export function getStripe(){const key=process.env.STRIPE_SECRET_KEY;if(!key)throw new Error("Thiếu STRIPE_SECRET_KEY");return new Stripe(key)}
export function getAppUrl(){return process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000"}
