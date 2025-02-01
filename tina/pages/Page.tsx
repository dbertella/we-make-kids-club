import { tinaField, useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type Props = {
	variables: PageQueryVariables;
	data: PageQuery;
	query: string;
}

const TinaPage = (props: Props) => {
	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const page = data.page;

	return (
		<main className="page-container">
			<h1 data-tina-field={tinaField(page, "seoTitle")}>{page.seoTitle}</h1>
			<section className="page-content">

				<div data-tina-field={tinaField(page, "body")}>
					<TinaMarkdown content={page.body} />
				</div>
				<section data-tina-field={tinaField(page, "testimonial")}>
				{page.testimonial?.map((testimonial) =>
					<div
						key={`${testimonial?.title}`}
					>
						<div data-tina-field={tinaField(testimonial, "imgSrc")}></div>
						{testimonial?.imgSrc && <img src={testimonial.imgSrc} alt={`${testimonial.title}`} />}
					</div>)}
			</section>
			</section>
		</main>
	)
}

export default TinaPage;
