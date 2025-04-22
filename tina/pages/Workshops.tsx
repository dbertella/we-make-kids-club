import { tinaField, useTina } from "tinacms/dist/react";
import type { WorkshopsQuery, WorkshopsQueryVariables, WorkshopsWorkshops } from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import ButtonComponent from "../components/ButtonComponent";

type Props = {
  variables: WorkshopsQueryVariables;
  data: WorkshopsQuery;
  query: string;
};

const WorkshopList = ({ workshops }: { workshops: WorkshopsWorkshops[] }) => {
  return <>
    {workshops.map((item, i) => (
      <div key={i}>
        <div data-tina-field={tinaField(item, "imgSrc")}></div>
        {item?.imgSrc && (
          <img src={item.imgSrc} alt="" />
        )}
        <div data-tina-field={tinaField(item, "workshopDate")}>
          <TinaMarkdown content={item?.workshopDate} />
        </div>
        <div data-tina-field={tinaField(item, "description")}>
          <TinaMarkdown content={item?.description} />
        </div>
        {item?.ctaUrl && <ButtonComponent url={item?.ctaUrl} label={workshops?.cta ?? 'Booking info'} />}
      </div>
    ))}
  </>
}

const TinaPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const page = data.workshops;
  const future: WorkshopsWorkshops[] = []
  const past: WorkshopsWorkshops[] = []

  page.workshops?.forEach(it => {
    if (it?.expired) {
      past.push(it as WorkshopsWorkshops)
    } else {
      future.push(it as WorkshopsWorkshops)
    }
  });

  return (
    <main>
      <h1 data-tina-field={tinaField(page, "title")}>{page.title}</h1>
      <section>
        <div data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} />
        </div>
      </section>
      <section
        data-tina-field={tinaField(page, "workshops")}
      >
        <h3>Upcoming</h3>
        <WorkshopList workshops={future} />
      </section>
      <section
        data-tina-field={tinaField(page, "workshops")}
      >
        <h3>Past</h3>
        <WorkshopList workshops={past} />
      </section>
    </main>
  );
};

export default TinaPage;
