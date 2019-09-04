import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AppLayout from 'layouts/App';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
                path={'/'}
                render={(props: any) => <AppLayout {...props}/>}
            />
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
