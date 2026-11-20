import type { Product } from "../../src/data/products";

interface Props {
  products: Product[];
}

const formatPrice = (priceInPence: number) =>
  (priceInPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

const HomePage = ({ products }: Props) => {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__title">
          <h1 id="home-title">eco-fashion lab</h1>
          <img className="home-decoration home-hero__thread" src="/thread.png" alt="" aria-hidden="true" />
        </div>
        <p className="home-hero__tagline">
          Creative sewing and upcycling for a more sustainable wardrobe
        </p>
        <p className="home-hero__announcement">
          « Eco-Fashion Lab is the new home of We Make Kids Club »
        </p>
        <p className="home-hero__intro">
          The <strong>eco-fashion lab</strong> helps children and adults discover
          the joy of making, mending and reimagining clothes and textiles.
        </p>
        <div className="home-hero__actions">
          <div className="home-hero__action">
            <a className="home-button" href="#workshops">
              Enquire about a workshop
            </a>
            <img className="home-decoration home-hero__tshirt" src="/tshirt.png" alt="" aria-hidden="true" />
          </div>
          <div className="home-hero__action">
            <a className="home-button" href="#kits">
              Shop sewing kits
            </a>
            <img className="home-decoration home-hero__needle" src="/needle.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="home-intro-panel" id="about" aria-labelledby="home-intro-title">
        <h2 id="home-intro-title">Learning through making</h2>
        <p>
          At the Eco-Fashion Lab, we use sewing, repair and upcycling to explore
          fashion, creativity and sustainability. We turn unwanted clothes and
          fabric into new possibilities — building practical skills, confidence
          and a more thoughtful relationship with what we wear.
        </p>
      </section>

      <section className="home-section home-workshops" id="workshops" aria-labelledby="workshops-title">
        <img className="home-decoration home-section__scissors" src="/scissors.png" alt="" aria-hidden="true" />
        <h2 id="workshops-title">
          Workshops for
          <br />
          schools, community groups &amp; workplaces
        </h2>
        <p>
          From school workshops to community events and workplace wellbeing
          sessions, I create hands-on experiences using sewing, repair and
          upcycling.
        </p>
        <p className="home-section__note">
          Previous experience includes primary schools, youth organisations and
          Netflix offices.
        </p>
        <a className="home-button home-section__button" href="/eco-fashion-workshops-for-schools">
          Explore workshops
        </a>
      </section>

      <section className="home-section home-kits" id="kits" aria-labelledby="kits-title">
        <img className="home-decoration home-section__scissors" src="/scissors.png" alt="" aria-hidden="true" />
        <h2 id="kits-title">Sewing kits for curious makers</h2>
        <p>
          Discover handmade kits that turn simple materials into something to
          love, wear or play with.
        </p>
        <div className="home-products">
          {products.slice(0, 2).map((product) => (
            <article className="home-product" key={product.id}>
              <a className="home-product__image" href={`/store/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <p>{product.shortDescription}</p>
              <a className="home-product__button" href={`/store/${product.slug}`}>
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <aside className="home-offer" aria-label="Launch offer">
        <h2>Launch offer</h2>
        <p>
          Hurry! The first 10 “Stitch a Softie kits” sold include a free pair of
          small fabric scissors. No code needed.
        </p>
      </aside>
    </main>
  );
};

export default HomePage;
