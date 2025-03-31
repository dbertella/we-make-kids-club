import React from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type { NewsQuery, NewsQueryVariables } from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import FormattedDate from "../../src/components/react/FormattedDate.tsx";
import ButtonComponent from "../components/ButtonComponent.tsx";

const components = {
  ButtonComponent,
};

type Props = {
  variables: NewsQueryVariables;
  data: NewsQuery;
  query: string;
};

export default function AdminNewsPost(props: Props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const news = data.news;

  return (
    <article>
      <div
        data-tina-field={tinaField(news, "heroImage")}
        className="hero-image"
      >
        {news.heroImage && (
          <img width={1020} height={510} src={news.heroImage} alt="" />
        )}
      </div>
      <div className="prose">
        <div className="title">
          <div className="date" data-tina-field={tinaField(news, "pubDate")}>
            <strong>{news.category}</strong>
            {" • "}
            <FormattedDate date={`${news.pubDate}`} />
            {/* {
							news.updatedDate && (
								<div className="last-updated-on" data-tina-field={tinaField(news, "updatedDate")} >
									Last updated on <FormattedDate date={news.updatedDate} />
								</div>
							)
						} */}
          </div>
          <h1 data-tina-field={tinaField(news, "title")}>{news.title}</h1>
          <hr />
        </div>
        <div data-tina-field={tinaField(news, "body")}>
          <TinaMarkdown content={news.body} components={components} />
        </div>
      </div>
    </article>
  );
}
