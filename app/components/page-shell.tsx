import BrandWordmark from './brand-wordmark';
export default function PageShell({ children }: { children: React.ReactNode }) {
  return <>
    <a href="#main" className="skip">Skip to content</a>
    <header className="header inner-header"><BrandWordmark/>
      <nav className="inner-nav" aria-label="Main navigation"><a href="/shop">Shop</a><a href="/#story">Our story</a><a href="/recipes">Recipes</a><a href="/find-us">Find us</a></nav>
    </header>
    <main id="main" className="inner-main">{children}</main>
    <footer><div className="footer-top"><BrandWordmark tagline="A TASTE OF LAOS, MADE WITH LOVE."/><p>Have a question or need help choosing a jar?<br/><a href="mailto:kinnaskitchen@gmail.com">kinnaskitchen@gmail.com ↗</a></p><div><a href="/shop">Shop the pantry</a><a href="/recipes">Recipes</a><a href="/find-us">Find us in New Mexico</a><a href="tel:+15055544721">505-554-4721</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kinna’s Kitchen</span><span>Small batches. Deep roots. A warm welcome.</span></div></footer>
  </>;
}
