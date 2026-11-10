import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Kinna’s Kitchen | Lao Roots. New Mexico Made.',description:'Handcrafted Lao chile pastes, vegan sauces, and mango salsa. Discover Kinna’s Kitchen, family recipes made with care in New Mexico.',robots:{index:false,follow:false},icons:{icon:'/assets/laos-chile-paste.webp'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
