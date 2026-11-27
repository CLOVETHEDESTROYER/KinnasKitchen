import PageShell from '../../components/page-shell';
import PaymentStatus from '../../components/payment-status';
export const metadata={title:'Your checkout | Kinna’s',robots:{index:false,follow:false}};
export default function CheckoutReturn(){return <PageShell><section className="page-intro"><p className="eyebrow">YOUR SQUARE CHECKOUT</p><PaymentStatus/><a className="button primary" href="/#bag">Return to your bag</a></section></PageShell>;}
