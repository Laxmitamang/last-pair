import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { BasketProvider } from "./basket";
import "./globals.css";
const sans=DM_Sans({variable:"--font-sans",subsets:["latin"]});
const serif=Instrument_Serif({variable:"--font-serif",subsets:["latin"],weight:"400"});
export const metadata:Metadata={metadataBase:new URL(process.env.APP_URL??"http://localhost:3000"),title:"Last Pair — Big brands. Small prices.",description:"Curated clearance footwear for students and smart spenders.",icons:{icon:"/favicon.svg"},openGraph:{title:"Last Pair",description:"Big brands. Small prices.",images:["/og.png"]},twitter:{card:"summary_large_image",title:"Last Pair",description:"Big brands. Small prices.",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><BasketProvider>{children}</BasketProvider></body></html>}
