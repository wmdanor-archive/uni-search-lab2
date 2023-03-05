import { NextPage } from "next";
import { ChangeEvent, ChangeEventHandler, FormEventHandler, useRef, useState } from "react";
import { Painting } from '@/types/index';
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";

const CreatePaintingPage: NextPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement | null>(null);
  const [painting, setPainting] = useState<Omit<Painting, 'id'>>({
    name: '',
    price: 0,
    isSold: false,
    createdDate: 0,
    author: '',
    contentDescription: '',
    materialsDescription: '',
  });
  const [isFetching, setIsFetching] = useState(false);

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (isFetching) {
      return;
    }

    setIsFetching(true);
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

  const changeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const name = event.target.name;

    switch (name) {
      case "name":
        setPainting((s) => ({ ...s, name: event.target.value }));
        break;
      case "price":
        setPainting((s) => ({ ...s, price: (event as ChangeEvent<HTMLInputElement>).target.valueAsNumber }));
        break;
      case "isSold":
        setPainting((s) => ({ ...s, isSold: (event as ChangeEvent<HTMLInputElement>).target.checked }));
        break;
      case "createdDate":
        setPainting((s) => ({ ...s, createdDate: new Date(event.target.value).getTime() }));
        break;
      case "author":
        setPainting((s) => ({ ...s, author: event.target.value }));
        break;
      case "contentDescription":
        setPainting((s) => ({ ...s, contentDescription: event.target.value }));
        break;
      case "materialsDescription":
        setPainting((s) => ({ ...s, materialsDescription: event.target.value }));
        break;
    }
  }

  return (
    <div>
      <NavBar />
      <h1 className="text-xl p-4 border-b">Create new painting record</h1>
      <div className="flex flex-col gap-3 p-4">
        <form onSubmit={submitHandler} className="flex flex-col gap-2" ref={ref}>
          <label>
            <span>Name*</span>
            <input type="text" name="name" required onChange={changeHandler} />
          </label>
          <label>
            <span>Author*</span>
            <input type="text" name="author" required onChange={changeHandler} />
          </label>
          <label>
            <span>Price*</span>
            <input type="number" name="price" required onChange={changeHandler}  />
          </label>
          <label>
            <span>Is sold</span>
            <input type="checkbox" name="isSold" onChange={changeHandler}  />
          </label>
          <label className="items-start">
            <span className="pt-1">Content description*</span>
            <textarea name="contentDescription" required onChange={changeHandler} />
          </label>
          <label className="items-start">
            <span className="pt-1">Materials description*</span>
            <textarea name="materialsDescription" required onChange={changeHandler} />
          </label>
          <label>
            <span>Created date*</span>
            <input type="date" name="createdDate" required onChange={changeHandler}  />
          </label>
          <button type="submit" disabled={isFetching || ref.current?.checkValidity() === false}>Create</button>
        </form>
      </div>
    </div>
  );

}

export default CreatePaintingPage;
