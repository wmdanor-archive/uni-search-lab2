import { PaintingsSearchOptions, RangeSearchOptions } from "@/services/paintings.service";
import { ChangeEventHandler, FC, FormEventHandler, useCallback, useEffect, useMemo, useState } from "react";

export interface PaintingsFiltersSubmitHandler {
  (filters: PaintingsSearchOptions): void;
}

export interface PaintingsFiltersProps {
  onSubmit?: PaintingsFiltersSubmitHandler;
  init?: PaintingsSearchOptions;
}

const PaintingsFilters: FC<PaintingsFiltersProps> = ({ onSubmit, init }) => {
  const [name, setName] = useState('');
  const [showSold, setShowSold] = useState(true);
  const [priceRange, setPriceRange] = useState<RangeSearchOptions>({});
  const [filterByDateRange, setFilterByDateRange] = useState(true);
  const [createdDate, setCreatedDate] = useState<number | undefined>();
  const [createdDateRange, setCreatedDateRange] = useState<RangeSearchOptions>({});
  const [author, setAuthor] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [materialsDescription, setMaterialsDescription] = useState('');

  useEffect(() => {
    if (!init) {
      return;
    }

    setName(init.name ?? '');
    setShowSold(init.isSold !== false);
    setPriceRange(init.price ?? {});
    setFilterByDateRange(init.createdDate === undefined || typeof init.createdDate !== 'number');
    setCreatedDate(typeof init.createdDate === 'number' ? init.createdDate : undefined);
    setCreatedDateRange(typeof init.createdDate !== 'number' ? init.createdDate ?? {} : {});
    setAuthor(init.author ?? '');
    setContentDescription(init.contentDescription ?? '');
    setMaterialsDescription(init.materialsDescription ?? '');
  }, [init]);

  const createdDateValue = useMemo(() => createdDate ? new Date(createdDate).toISOString().replace(/T.*/, '') : '', [createdDate]);
  const createdDateMinValue = useMemo(() => createdDateRange.min ? new Date(createdDateRange.min).toISOString().replace(/T.*/, '') : '', [createdDateRange.min]);
  const createdDateMaxValue = useMemo(() => createdDateRange.max ? new Date(createdDateRange.max).toISOString().replace(/T.*/, '') : '', [createdDateRange.max]);

  const submitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    const filters: PaintingsSearchOptions = {};

    if (name) {
      filters.name = name;
    }

    if (!showSold) {
      filters.isSold = false;
    }

    if (priceRange.min !== undefined || priceRange.max !== undefined) {
      filters.price = priceRange;
    }

    if (filterByDateRange) {
      if (createdDateRange.min || createdDateRange.max) {
        filters.createdDate = createdDateRange;
      }
    } else {
      if (createdDate) {
        filters.createdDate = createdDate;
      }
    }

    if (author) {
      filters.author = author;
    }

    if (contentDescription) {
      filters.contentDescription = contentDescription;
    }

    if (materialsDescription) {
      filters.materialsDescription = materialsDescription;
    }

    onSubmit(filters);
  };

  const textChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const mapping = {
      name: setName,
      author: setAuthor,
      contentDescription: setContentDescription,
      materialsDescription: setMaterialsDescription,
    };

    mapping[(event.target.name as keyof typeof mapping)](event.target.value);
  }, [setName, setAuthor, setContentDescription, setMaterialsDescription]);

  const showSoldChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setShowSold(event.currentTarget.checked);
  }, [setShowSold]);

  const filterByDateRangeChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setFilterByDateRange(event.currentTarget.checked);
  }, [setFilterByDateRange]);

  const dateChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const value = event.currentTarget.valueAsNumber;
 
    switch (event.currentTarget.name) {
      case 'date':
        setCreatedDate(Number.isNaN(value) ? undefined : value);
        break;
      case 'date.gte':
        setCreatedDateRange({ ...createdDateRange, min: Number.isNaN(value) ? undefined : value });
        break;
      case 'date.lte':
        setCreatedDateRange({ ...createdDateRange, max: Number.isNaN(value) ? undefined : value });
        break;
    }
  }, [createdDateRange, setCreatedDate]);

  const priceRangeChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const value = event.currentTarget.valueAsNumber;
 
    switch (event.currentTarget.name) {
      case 'price.gte':
        setPriceRange({ ...priceRange, min: Number.isNaN(value) ? undefined : value });
        break;
      case 'price.lte':
        setPriceRange({ ...priceRange, max: Number.isNaN(value) ? undefined : value });
        break;
    }
  }, [priceRange, setPriceRange]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-lg">Filters</h2>
      <form onSubmit={submitHandler} className="flex flex-col gap-2">
        <label>
          <span>Name</span>
          <input type="text" name="name" value={name} onChange={textChangeHandler} />
        </label>
        <label>
          <span>Author</span>
          <input type="text" name="author" value={name} onChange={textChangeHandler} />
        </label>
        <label>
          <span>Show sold</span>
          <input type="checkbox" checked={showSold} onChange={showSoldChangeHandler} />
        </label>
        <label className="items-start">
          <span className="pt-1">Content description</span>
          <textarea name="contentDescription" value={name} onChange={textChangeHandler} />
        </label>
        <label className="items-start">
          <span className="pt-1">Materials description</span>
          <textarea name="materialsDescription" value={name} onChange={textChangeHandler} />
        </label>
        <label>
          <span>Filter by date range</span>
          <input type="checkbox" checked={filterByDateRange} onChange={filterByDateRangeChangeHandler} />
        </label>
        <label>
          <span>Created date</span>
          {filterByDateRange ?
          (<>
            <input type="date" name="date.gte" onChange={dateChangeHandler} value={createdDateMinValue} />
            <span>-</span>
            <input type="date" name="date.lte" onChange={dateChangeHandler} value={createdDateMaxValue} />
          </>)
          :
          <input type="date" name="date" onChange={dateChangeHandler} value={createdDateValue} />}
        </label>
        <label>
          <span>Price</span>
          <input type="number" step="1" pattern="\d+" name="price.gte" value={priceRange.min ?? ''} onChange={priceRangeChangeHandler} />
          <span>-</span>
          <input type="number" step="1" pattern="\d+" name="price.lte" value={priceRange.max ?? ''} onChange={priceRangeChangeHandler} />
        </label>
        <button type="submit">Apply</button>
      </form>
    </div>
  );
}

export default PaintingsFilters;
