import cx from 'classnames';
import Header from 'components/Header';
import usePerfectScrollbar from 'components/PerfectScrollbar';
import Sidebar from 'components/Sidebar';
import { History } from 'history';
import React, { useState } from 'react';
import {RouteType} from 'routes/Route';
import useStyles from './style';

interface AppProps {
  history: History;
  homeRoute: RouteType;
  profileRoute: RouteType;
  sidebarRoutes: RouteType[];
  children?: React.ReactNode;
}

const App = (props: AppProps) => {
  const classes = useStyles();
  const [miniActive, setMiniActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setScrollBarElementRef = usePerfectScrollbar();

  if (
    (props.homeRoute.component == null) ||
    (props.profileRoute.component == null)
  ) {
    return (<div>Error building routes!</div>);
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        history={props.history}
        appRoutes={{
          homeRoute: props.homeRoute,
          profileRoute: props.profileRoute,
          sidebarRoutes: props.sidebarRoutes
        }}
        user={{
          name: 'Test'
        }}
        miniActive={miniActive}
        open={sidebarOpen}
        handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div
        className={
          classes.mainPanel + ' ' +
          cx({
            [classes.mainPanelSidebarMini]: miniActive,
            [classes.mainPanelWithPerfectScrollbar]:
            navigator.platform.indexOf('Win') > -1
          })
        }
      >
        <Header
          miniActive={false}
          sidebarMinimize={() => setMiniActive(!miniActive)}
          handleSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          history={props.history}
          allRoutes={[
              ...props.sidebarRoutes,
              props.profileRoute,
              props.homeRoute
          ]}
        />
        <div className={classes.content}>
          <div
              className={classes.container}
              ref={setScrollBarElementRef}
          >
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
