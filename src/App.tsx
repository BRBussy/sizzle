import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import AppLayout from 'layouts/App';

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
                render={() => <Redirect to={'/app'}/>}
            />
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
