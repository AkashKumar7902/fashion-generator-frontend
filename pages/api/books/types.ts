import { NextApiRequest, NextApiResponse } from 'next';

import { productType } from '../../../men_types';
import fs from 'fs';

const ProductType = Object.values(productType);

const bookTypeListHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {
    if (req.method === 'GET') {
        res.status(200).json(ProductType);
    } else {
        res.status(401).json({
            message: `HTTP method ${req.method} is not supported.`
        });
    }
}

export default bookTypeListHandler;
