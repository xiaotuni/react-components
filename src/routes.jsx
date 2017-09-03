import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Default, Page1, Page2, NotFound } from 'containers';

export default () => {
  return (
    <Route path="/" component={App} >
      <IndexRoute component={Default} isIndex={1} />
      // <Route path="default" component={Default} />
      // <Route path="page1" component={Page1} />
      // <Route path="page2" component={Page2} />
      // <Route path="*" component={NotFound} status={404} />
    </Route >
  );
};
