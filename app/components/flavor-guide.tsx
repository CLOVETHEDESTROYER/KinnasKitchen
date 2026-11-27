const flavors = [
  {name:'Savory',copy:'Deep chile flavor for noodles, dipping, and your next stir-fry.',href:'/shop/laos-chile-paste',link:'Explore chile paste'},
  {name:'Tangy',copy:'Sweet, tangy tamarind for dipping, glazing, and a finishing drizzle.',href:'/shop/vegan-tamarind-chile-sauce',link:'Explore tamarind sauce'},
  {name:'Fruity',copy:'Mango sweetness with a chile kick. Bring a spoonful to taco night.',href:'/shop/vegan-mango-salsa',link:'Explore mango salsa'},
];
export default function FlavorGuide(){return <section className="flavor-guide" aria-labelledby="flavor-title"><div className="flavor-heading"><h2 id="flavor-title">Find your flavor.</h2><p>A little help choosing your first jar.<br/>What’s cooking at your table?</p></div><div className="flavor-options">{flavors.map((f,i)=><a href={f.href} key={f.name}><span className="flavor-number">0{i+1}</span><h3>{f.name}</h3><p>{f.copy}</p><span className="flavor-link">{f.link} <span aria-hidden="true">↗</span></span></a>)}</div></section>}
