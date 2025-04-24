import { tinaField, useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import ButtonComponent from "../components/ButtonComponent.tsx";

const components = {
  ButtonComponent,
};

type Props = {
  variables: PageQueryVariables;
  data: PageQuery;
  query: string;
};

const TinaPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const page = data.page;

  return (
    <main>
      <h1 data-tina-field={tinaField(page, "title")}>{page.title}</h1>
      <section>
        <div data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} components={components} />
        </div>
      </section>
    </main>
  );
};

export default TinaPage;
