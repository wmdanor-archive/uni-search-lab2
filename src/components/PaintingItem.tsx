import { Painting } from "@/types";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";

export interface PaintingItemDeleteHandler {
  (painting: Painting): void;
}

export interface PaintingItemProps {
  painting: Painting;
  onDelete?: PaintingItemDeleteHandler;
}

const PaintingItem: FC<PaintingItemProps> = ({ painting, onDelete }) => {
  const { id, name, price, isSold, createdDate } = painting;
  const [createdDateString, setCreatedDateString] = useState(new Date(createdDate).toISOString());

  // Fix for `Error: Text content does not match server-rendered HTML."`
  useEffect(() => {
    setCreatedDateString(new Date(createdDate).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
    }));
  }, [createdDate]);

  const deleteHandler = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const isUserSure = window.confirm('Are you sure you want to delete this painting record?');
  
    if (!isUserSure) {
      return;
    }

    fetch('/api/paintings', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }).then(() => {
      if (onDelete) {
        onDelete(painting);
      }
    }).catch(() => {
      window.alert('Error ocurred, while deleting painting record, try again later.');
    });
  }, [id]);

  return(
    <div data-id={id} className="flex flex-col gap-3 border-t last:border-b p-4">
      <h2 className="text-lg">{name}</h2>
      <div className="flex flex-col">
        <span>Price: {price}$</span>
        {
          isSold ?
          (<span className="text-red-600 font-semibold">Sold</span>) :
          (<span className="text-green-600 font-semibold">Selling</span>)
        }
      </div>
      <div className="flex flex-col">
        <span>Created at: {createdDateString}</span>
      </div>
      <button onClick={deleteHandler} data-variant="danger">Delete</button>
    </div>
  );
}

export default PaintingItem;
