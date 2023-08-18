import { NextApiRequest, NextApiResponse } from 'next';


import { productType } from '../../../men_types';
import milvusClient from '../../../lib/prisma'

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 8;

enum SortType {
  PRICE = 'price',
  PUBLISHED_AT = 'publishedAt'
};
enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
};
const sortTypes = Object.values(SortType);
const sortOrders = Object.values(SortOrder);
const ProductType = Object.keys(productType);

const bookListHandler =  async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'GET') {
    try {
      res.status(200).json(await getBookList(req));
    } catch (err:any) {
      console.error(err)
      res.status(500).json({
        message: err.message
      })
    }
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`
    });
  }
}

async function getBookList(req: NextApiRequest) {
  // Querying with joins (Many to many relation).
  const query = parseBookListQuery(req.query, true, true);
  const load = await milvusClient.loadCollectionSync({
    collection_name: 'men_clothing',
  });
  console.log('Collection is loaded.', load);
  const products : any = await milvusClient.query({
    collection_name: "men_clothing",
    filter: "cloth_type in ['tshirt']",
    output_fields: ["id", "json_data"],
    limit: 10
  });

  products.forEach((product:any) => {
   product.json_data = JSON.parse(product.json_data);
  });
  
  const searchParams = {
    params: { nprobe: 1024 }
  };

  const temp: any = await milvusClient.query({
    collection_name: "men_clothing",
    output_fields: ["id"]
  });
  
  return {
    content: products,
    total: temp.length
  }
}

function parseBookListQuery(query: any, sorting: boolean = false, paging: boolean = false) {
  const q:any = {}

  // Filtering.
  // Reference: https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting
  q.where = {};
  if (typeof query.type === 'string') {
    if (!ProductType.includes(query.type)) {
      throw new Error(`Parameter \`type\` must be one of [${ProductType.join(', ')}].`);
    }
    q.where.type = query.type;
  }

  // Sorting.
  if (sorting) {
    if (sortTypes.includes(query.sort)) {
      let order = SortOrder.ASC;
      if (sortOrders.includes(query.order)) {
        order = query.order 
      }

      if (query.sort === SortType.PRICE) {
        q.orderBy = {
          price: order
        };
      } else if (query.sort === SortType.PUBLISHED_AT) {
        q.orderBy = {
          publishedAt: order
        };
      }
    }
  }

  // Paging.
  if (paging) {
    let page = DEFAULT_PAGE_NUM;
    let size = DEFAULT_PAGE_SIZE;
    if (typeof query.page === 'string') {
      page = parseInt(query.page);
    }
    if (typeof query.size === 'string') {
      size = parseInt(query.size);
    }
    if (size < 0 || size > 100) {
      throw new Error('Parameter `size` must between 0 and 100.');
    }
    q.take = size;
    q.skip = (page - 1) * size;
  }

  return q;
}

export default bookListHandler;
