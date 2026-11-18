export default function PageShell({ children }: { children: React.ReactNode }) {
  return <>
    <a href="#main" className="skip">Skip to content</a>
    <div className="announcement">A taste of Laos. A little New Mexico soul. <span>Handcrafted in small batches.</span></div>
    <header className="header inner-header"><a href="/" className="wordmark" aria-label="Kinna’s Kitchen home">Kinna’s <span>Kitchen</span><small>LAO ROOTS · NEW MEXICO MADE</small></a>
      <nav className="inner-nav" aria-label="Main navigation"><a href="/shop">Shop</a><a href="/#story">Our story</a><a href="/recipes">Recipes</a><a href="/find-us">Find us</a></nav>
    </header>
    <main id="main" className="inner-main">{children}</main>
    <footer><div className="footer-top"><a className="wordmark" href="/">Kinna’s <span>Kitchen</span><small>A TASTE OF LAOS, MADE WITH LOVE.</small></a><p>Have a question or need help choosing a jar?<br/><a href="mailto:kinnaskitchen@gmail.com">kinnaskitchen@gmail.com ↗</a></p><div><a href="/shop">Shop the pantry</a><a href="/recipes">Recipes</a><a href="/find-us">Find us in New Mexico</a><a href="tel:+15055544721">505-554-4721</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kinna’s Kitchen</span><span>Small batches. Deep roots. A warm welcome.</span></div></footer>
  </>;
}
