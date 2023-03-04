import { PaintingsService } from "@/services/paintings.service";
import { Painting } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (_req, res) => {
  const paintingsService = new PaintingsService();

  await paintingsService.deleteIndex();
  await paintingsService.initialize();
  
  const paintings: Omit<Painting, 'id'>[] = [
    {
      name: 'Bulop',
      price: 50,
      isSold: false,
      createdDate: Date.UTC(2022, 12, 3),
    },
    {
      name: 'Bruh',
      price: 100,
      isSold: false,
      createdDate: Date.UTC(2019, 5, 17),
    }
  ];

  const results = [];

  for (const painting of paintings) {
    const result = await paintingsService.create(painting);

    results.push(result);
  }

  res.json(results);
}

export default handler;
