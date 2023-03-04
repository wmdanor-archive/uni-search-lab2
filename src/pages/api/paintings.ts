import { Painting } from './../../types/index';
import { NextApiHandler } from "next";
import { PaintingsService } from '@/services/paintings.service';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const body: Omit<Painting, 'id'> = JSON.parse(req.body);

    const paintingsService = new PaintingsService();
    const result = await paintingsService.create(body);

    res.status(200).json(result);
  } else if (req.method === 'DELETE')  {
    const body: { id: string } = JSON.parse(req.body);

    const paintingsService = new PaintingsService();
    await paintingsService.delete(body.id);

    res.status(200).end();
  } else {
    res.status(404).end();
  }
}

export default handler;
