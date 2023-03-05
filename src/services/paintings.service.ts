import { ESPainting, Painting } from './../types/index';
import { Client } from '@elastic/elasticsearch';
import { CreateResponse, MappingProperty, QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { nanoid } from 'nanoid';
import { getDateRange } from '@/utils/getDateRange';

export interface RangeSearchOptions {
  min?: number;
  max?: number;
}

export interface PaintingsSearchOptions {
  name?: string;
  price?: RangeSearchOptions;
  isSold?: boolean;
  createdDate?: number | RangeSearchOptions;
  author?: string;
  contentDescription?: string;
  materialsDescription?: string;
}

export class PaintingsService {
  private readonly INDEX_NAME = 'paintings-index';
  private readonly client: Client;

  public constructor() {
    this.client = new Client({
      node: 'http://localhost:9200',
    });
  }

  // TODO: delete method before signing off
  public async deleteIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.INDEX_NAME });

    if (!exists) {
      return;
    }
    
    await this.client.indices.delete({ index: this.INDEX_NAME });
  }

  public async initialize(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.INDEX_NAME });

    if (exists) {
      return;
    }

    const properties: Record<keyof Omit<Painting, 'id'>, MappingProperty> = {
      name: { type: 'keyword' },
      price: { type: 'integer' },
      isSold: { type: 'boolean' },
      createdDate: { type: 'date', format: 'epoch_millis' },
      author: { type: 'text', analyzer: 'standard' },
      contentDescription: { type: 'text', analyzer: 'english' },
      materialsDescription: { type: 'text', analyzer: 'custom_mapper' },
    };

    await this.client.indices.create({
      index: this.INDEX_NAME,
      mappings: {
        properties,
      },
      settings: {
        analysis: {
          analyzer: {
            custom_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              char_filter: ['custom_mapper'],
              filter: ['lowercase'],
            },
          },
          char_filter: {
            custom_mapper: {
              type: 'mapping',
              mappings: [
                '== => equal',
                '> => greater than',
                '< => lower than',
              ],
            },
          },
        },
      },
    });
  }

  public async search(options: PaintingsSearchOptions) {
    const query: QueryDslQueryContainer = {
      bool: {
        must: [],
      }
    };

    const pushQuery = (q: QueryDslQueryContainer) => { (query!.bool!.must as QueryDslQueryContainer[]).push(q) };

    if (options.name !== undefined) {
      pushQuery({
        wildcard: {
          name: {
            value: `*${options.name}*`,
            case_insensitive: true,
          },
        },
      });
    }

    if (options.price) {
      pushQuery({
        range: {
          price: {
            gte: options.price.min,
            lte: options.price.max,
          },
        },
      });
    }

    if (options.createdDate !== undefined) {
      pushQuery({
        range: {
          createdDate: getDateRange(options.createdDate),
        },
      });
    }

    if (options.isSold !== undefined) {
      pushQuery({
        term: {
          isSold: options.isSold,
        },
      });
    }

    if (options.author !== undefined) {
      pushQuery({
        match: {
          author: options.author,
        },
      });
    }

    if (options.contentDescription !== undefined) {
      pushQuery({
        match: {
          contentDescription: options.contentDescription,
        },
      });
    }

    if (options.materialsDescription !== undefined) {
      pushQuery({
        match: {
          materialsDescription: options.materialsDescription,
        },
      });
    }

    const result = await this.client.search<ESPainting>({
      index: this.INDEX_NAME,
      query: (query!.bool!.must! as []).length === 0 ? {
        match_all: {},
      } : query,
    });

    return result.hits.hits.map(({ _id, _source }) => ({
      id: _id,
      ..._source,
      createdDate: Number.parseInt(_source!.createdDate)
    })) as Painting[];
  }

  public async create(painting: Omit<Painting, 'id'>): Promise<CreateResponse> {
    const result = await this.client.create({
      id: nanoid(),
      index: this.INDEX_NAME,
      document: {
        ...painting,
        createdDate: painting.createdDate.toString(),
      },
    });

    await this.client.indices.refresh({ index: this.INDEX_NAME });

    return result;
  }

  public async get(id: string) {
    return await this.client.get({
      id,
      index: this.INDEX_NAME,
    });
  }

  public async delete(id: string) {
    return await this.client.delete({
      id,
      index: this.INDEX_NAME,
    });
  }
}
