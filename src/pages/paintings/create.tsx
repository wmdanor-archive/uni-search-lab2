import { NextPage } from "next";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Painting } from '@/types/index';
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";

const CreatePaintingPage: NextPage = () => {
  const router = useRouter();
  const [painting, setPainting] = useState<Omit<Painting, 'id'>>({
    name: '',
    price: 0,
    isSold: false,
    createdDate: 0,
  });
  const [isFetching, setIsFetching] = useState(false);

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (isFetching) {
      return;
    }

    fetch('/api/paintings', {
      method: 'POST',
      body: JSON.stringify(painting),
    })
    .then(() => {
      // timeout because updates or not instant
      setTimeout(() => {
        router.push('/');
      }, 100)
    })
    .catch(() => window.alert('Error ocurred while creating a painting record, try again later'))
    .finally(() => setIsFetching(false))
  }

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.target.name;

    console.log(event);

    switch (name) {
      case "name":
        setPainting((s) => ({ ...s, name: event.target.value }));
        break;
      case "price":
        setPainting((s) => ({ ...s, price: event.target.valueAsNumber }));
        break;
      case "isSold":
        setPainting((s) => ({ ...s, isSold: event.target.checked }));
        break;
      case "createdDate":
        setPainting((s) => ({ ...s, createdDate: new Date(event.target.value).getTime() }));
        break;
    }
  }

  return <div>
    <NavBar />
    <form className="flex flex-col" onSubmit={submitHandler}>
      <label>
        Name:
        <input type="text" name="name" required onChange={changeHandler} />
      </label>
      <label>
        Price:
        <input type="number" name="price" required onChange={changeHandler}  />
      </label>
      <label>
        Is sold:
        <input type="checkbox" name="isSold" onChange={changeHandler}  />
      </label>
      <label>
        Created date:
        <input type="date" name="createdDate" required onChange={changeHandler}  />
      </label>
      <button type="submit" disabled={isFetching}>Create</button>
    </form>
  </div>
}

export default CreatePaintingPage;