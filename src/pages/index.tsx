import { GetServerSideProps, NextPage } from "next"
import { PaintingsSearchOptions, PaintingsService } from "@/services/paintings.service"
import PaintingsFilters, { PaintingsFiltersSubmitHandler } from "@/components/PaintingsFilters"
import { Painting } from "@/types";
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import PaintingItem, { PaintingItemDeleteHandler } from "@/components/PaintingItem";

export interface HomePageProps {
  paintings: Painting[];
}

const HomePage: NextPage<HomePageProps> = ({ paintings }) => {
  const router = useRouter();
  const [clientPaintings, setClientPaintings] = useState(paintings);
  const [filters, setFilters] = useState<PaintingsSearchOptions>(JSON.parse(router.query.filters as string ?? '{}'));

  useEffect(() => setClientPaintings(paintings), [paintings]);

  const deleteHandler = useCallback<PaintingItemDeleteHandler>(({ id }) => {
    setClientPaintings((s) => s.filter(painting => painting.id !== id));
  }, [setClientPaintings]);

  const paintingItems = useMemo(() => {
    return clientPaintings.map(painting => (<PaintingItem key={painting.id} painting={painting} onDelete={deleteHandler} />));
  }, [clientPaintings]);

  const submitHandler: PaintingsFiltersSubmitHandler = (f) => {
    setFilters(f);
    router.push({
      pathname: router.pathname,
      query: {
        filters: JSON.stringify(f),
      },
    });
  }

  return (
    <div>
      <NavBar />
      <h1 className="text-xl p-4 border-b">Paintings</h1>
      <PaintingsFilters onSubmit={submitHandler} init={filters} />
      {
        paintingItems.length === 0 ?
        (
          <div className="flex flex-col border-t last:border-b p-4 items-center">
            <span className="text-red-600 text-lg">No painting records</span>
          </div>
        ) :
        (paintingItems)
      }
    </div>
  );
}

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const filters: PaintingsSearchOptions = JSON.parse(context.query.filters as string ?? '{}');

  const paintingsService = new PaintingsService();
  const paintings = await paintingsService.search(filters);

  return {
    props: {
      paintings,
    },
  };
}
