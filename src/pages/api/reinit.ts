import { PaintingsService } from "@/services/paintings.service";
import { Painting } from "@/types";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (_req, res) => {
  const paintingsService = new PaintingsService();

  await paintingsService.deleteIndex();
  await paintingsService.initialize();
  
  const paintings: Omit<Painting, 'id'>[] = [
    {
      name: 'Trees in the forest',
      price: 50,
      isSold: false,
      createdDate: Date.UTC(2022, 12, 3),
      author: 'James D.K.',
      contentDescription: 'This painting represents trees in the forest',
      materialsDescription: 'The painting was created using oil paint',
    },
    {
      name: 'Illusion',
      price: 100,
      isSold: false,
      createdDate: Date.UTC(2019, 5, 17),
      author: 'Hyper',
      contentDescription: 'Painting in abstract style, people who see it says that it has some elements of optical illusion',
      materialsDescription: 'Created using watercolor painting',
    },
    {
      name: 'Temptation',
      price: 129,
      isSold: true,
      createdDate: Date.UTC(2023, 3, 2),
      author: 'Hyper',
      contentDescription: 'Another one abstract work from Hyper, people are often feeling some kind of strange temptation when they see this work',
      materialsDescription: 'Created using watercolor painting',
    },
    {
      name: 'Sunrise',
      price: 75,
      isSold: false,
      createdDate: Date.UTC(2020, 6, 29),
      author: 'James Kor',
      contentDescription: 'Very unique painting showcasing the sunrise, author created it being inspired by the sunrise he sees every day from his window at home',
      materialsDescription: 'The only tool used for drawing is pencil',
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
