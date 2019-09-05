import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import AppLayout from 'layouts/App';
import PublicLayout from 'layouts/Public';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
                path={'/app'}
                render={(props: any) => <AppLayout {...props}/>}
            />
            <Route
                path={'/'}
                render={(props: any) => <PublicLayout {...props}/>}
            />
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
