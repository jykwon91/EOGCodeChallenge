import React from 'react';
import { gql } from 'apollo-boost';

const subQuery = gql`
subscription {
  newMeasurement{
    metric,
    at,
    value,
    unit
  }
}
`;