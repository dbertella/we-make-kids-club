import { tinaField, useTina } from "tinacms/dist/react";
import type {
  PageQuery,
  PageQueryVariables,
  PageTestimonial,
} from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type Props = {
  variables: PageQueryVariables;
  data: PageQuery;
  query: string;
};

const HomePage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const page = data.page;

  return (
    <>
      <header className="header">
        <div className="header-text">
          <h1>WE MAKE KIDS CLUB</h1>
          <h2>Eco-fashion workshops for everyone</h2>
        
        </div>
      </header>
      <section
        className="activities"
        data-tina-field={tinaField(page, "testimonial")}
      >
        {page.testimonial?.map((testimonial) => {
          const key = testimonial?.title || `testimonial-${Math.random()}`;
          const hasUrl = !!testimonial?.url;
          
          return (
            <div
              key={key}
              className={`activity-card ${hasUrl ? "activity-card--clickable" : ""}`}
            >
              <div data-tina-field={tinaField(testimonial, "imgSrc")}></div>
              {testimonial?.imgSrc && (
                <img 
                  src={testimonial.imgSrc} 
                  alt={testimonial.title || ""} 
                />
              )}
              {testimonial?.title && (
                <h3 data-tina-field={tinaField(testimonial, "title")}>
                  {testimonial.title}
                </h3>
              )}
              {hasUrl && testimonial.url && (
                <a
                  href={testimonial.url}
                  className="activity-card__link"
                  data-tina-field={tinaField(testimonial, "url")}
                  aria-label={`${testimonial.title || "Testimonial"} - ${testimonial.url}`}
                >
                  <span className="sr-only">{testimonial.title || "View testimonial"}</span>
                </a>
              )}
            </div>
          );
        })}
      </section>

      <main>
        <section data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} />
        </section>
        <section data-tina-field={tinaField(page, "cta")} className="cta">
          <a href={page.cta?.url} className="button">
            {page.cta?.title}
          </a>
          <p className="disclaimer">{page.cta?.disclaimer}</p>
        </section>
      </main>
    </>
  );
};

export default HomePage;
