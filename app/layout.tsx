import type {Metadata} from 'next';
import { indexable, absoluteUrl } from './lib/seo';
import { StructuredData } from './components/structured-data';
import './globals.css';
export const metadata:Metadata={title:'Kinna’s Kitchen | Lao Roots. New Mexico Made.',description:'Handcrafted Lao chile pastes, vegan sauces, and mango salsa made in New Mexico.',robots:{index:indexable,follow:true},icons:{icon:'/assets/laos-chile-paste.webp'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StructuredData data={{'@context':'https://schema.org','@type':'Organization','@id':absoluteUrl('/#organization'),name:'Kinna’s Kitchen',url:absoluteUrl('/'),description:'Family recipes from Laos. Small-batch chile pastes, sauces, and mango salsa made in New Mexico.',email:'kinnaskitchen@gmail.com'}}/>{children}</body></html>}
