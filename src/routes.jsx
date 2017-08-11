import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Default, NotFound } from 'containers';

export default () => {
  return (
    <Route path="/" component={App} >
      <IndexRoute component={Default} isIndex={1} />
      <Route path="default" component={Default} />
      <Route path="*" component={NotFound} status={404} />
    </Route >
  );
};
