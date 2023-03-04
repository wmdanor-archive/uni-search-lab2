import { GetServerSideProps, NextPage } from "next"
import { PaintingsSearchOptions, PaintingsService } from "@/services/paintings.service"
import PaintingsFilters, { PaintingsFiltersSubmitHandler } from "@/components/PaintingsFilters"
import { Painting } from "@/types";
import { MouseEventHandler, useCallback, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";

export interface HomePageProps {
  paintings: Painting[];
}

const HomePage: NextPage<HomePageProps> = ({ paintings }) => {
  const router = useRouter();
  const [clientPaintings, setClientPaintings] = useState(paintings);
  const [filters, setFilters] = useState<PaintingsSearchOptions>(JSON.parse(router.query.filters as string ?? '{}'));

  const submitHandler: PaintingsFiltersSubmitHandler = (f) => {
    console.log(f);
    setFilters(f);
    router.push({
      pathname: router.pathname,
      query: {
        filters: JSON.stringify(f),
      },
    });
  }

  const createDeleteHandler = useCallback((id: string) => {
    const deleteHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
      const isUserSure = window.confirm('Are you sure?');
  
      if (!isUserSure) {
        return;
      }

      fetch('/api/paintings', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }).then(() => {
        setClientPaintings((s) => s.filter(painting => painting.id !== id));
      });
    }

    return deleteHandler;
  }, []);

  return (
    <div>
      <NavBar />
      <PaintingsFilters onSubmit={submitHandler} init={filters} />
      <div>
        <div>Paintings</div>
        {clientPaintings.map(painting => (
          <div key={painting.id} className="flex flex-col">
            <span>{painting.id}</span>
            <span>{painting.name}</span>
            <span>{painting.price}$</span>
            <span>{painting.isSold ? 'Sold' : 'Selling'}</span>
            <span>{new Date(painting.createdDate).toISOString()}</span>
            <button onClick={createDeleteHandler(painting.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
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
