import React from 'react';
import { tinaField, useTina } from "tinacms/dist/react";
import type { EventsQuery, EventsQueryVariables } from '../__generated__/types';
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import FormattedDate from '../../src/components/react/FormattedDate.tsx';


type Props = {
	variables: EventsQueryVariables;
	data: EventsQuery;
	query: string;
}

export default function AdminEventsPost(props: Props) {

	const { data } = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const events = data.events;

	return (
		<article>
			<div data-tina-field={tinaField(events, "heroImage")} className="hero-image">
				{events.heroImage && <img width={1020} height={510} src={events.heroImage} alt="" />}
			</div>
			<div className="prose">
				<div className="title">
					<div className="date" data-tina-field={tinaField(events, "pubDate")} >
						<FormattedDate date={`${events.pubDate}`} />
						{
							events.updatedDate && (
								<div className="last-updated-on" data-tina-field={tinaField(events, "updatedDate")} >
									Last updated on <FormattedDate date={events.updatedDate} />
								</div>
							)
						}
					</div>
					<h1 data-tina-field={tinaField(events, "title")} >{events.title}</h1>
					<hr />
				</div>
				<div data-tina-field={tinaField(events, "body")}>
					<TinaMarkdown content={events.body} />
				</div>
			</div>
		</article>
	);
}
