import { Button, Typography } from '@material-ui/core';
import {
  NumberExact,
  NumberRange,
  StringExact,
  StringSubstring
} from 'bizzle/search/criterion';
import React from 'react';
import { Link } from 'react-router-dom';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';

const testCrit = async () => {
  const criteria = {
    name: StringSubstring('sam'),
    costAmount: NumberExact(1200.234),
    $or: [
      {
        name: StringExact('sam'),
        amountDue: NumberRange(
          {
            number: 100
          },
          {
            number: 400
          }
        )
      },
      {
        $or: [
          {
            surname: StringSubstring('sam')
          }
        ]
      }
    ]
  };

  try {
    await jsonRPCRequest({
      url: 'http://localhost:8080',
      method: 'Exercise-Store.Find',
      request: {
        criteria
      },
      verbose: true
    });
  } catch (e) {
    console.error('jsonrpc failure:', e);
  }
};

const Party1 = () => {
  return (
    <div>
      <Button
        onClick={testCrit}
      >
        Test Criterion
      </Button>
      <Typography variant={'body1'}>
        <Link to={'/pubView'}>
          go to a Public View
        </Link>
      </Typography>
    </div>
  );
};

export default Party1;
