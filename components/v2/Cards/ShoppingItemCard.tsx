import * as React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { VariantType, useSnackbar } from 'notistack';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { shoppingCartState } from 'atoms';
import { useRecoilState } from 'recoil';

import { BookProps } from 'const';
import { currencyFormat } from 'lib/utils';
import HalfRating from 'components/v2/Rating/HalfRating';

export default function ShoopingItemCard(props: BookProps) {
  const {
    name,
    price,
    discount,
    cloth_type,
    image_url,
    id
  } = props;
  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);

  const { enqueueSnackbar } = useSnackbar();

  const addItem = () => {
    setShoppingCart((oldShoppingCart) => {
      const existingItem = oldShoppingCart.find((i) => i.id === id);
      if (existingItem) {
        const newItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        enqueueSnackbar(`"${name}" was successfully added.`, {
          variant: 'success',
        });
        return [...oldShoppingCart.filter((i) => i.id !== id), newItem];
      }
      enqueueSnackbar(`"${name}" was successfully added.`, {
        variant: 'success',
      });
      return [
        ...oldShoppingCart,
        {
          ...props,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <div className='card card-compact w-96 bg-base-100 shadow-xl'>
      <figure>
        <Image
          src={image_url}
          alt={name}
          width={384}
          height={140}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{name}</h2>
        <div className='card-actions justify-end'>
          <button className='btn' onClick={addItem}>
            {currencyFormat(price)}
            <ShoppingCartIcon className='h-6 w-6' />
          </button>
        </div>
      </div>
    </div>
  );
}
