import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { Routes } from './routes';

// import NotFoundPage from './examples/NotFound';
// import ServerError from './examples/ServerError';

// components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import NotFoundPage from './pages/NotFound';
import ServerError from './pages/ServerError';
//deploy
import SignIn from './deploy/Signin';
import AddItem from './deploy/AddItem';
import AddAdmin from './deploy/AddAdmin';
import AllAdmin from './deploy/AdminList';
import AllCustomer from './deploy/CustomerList';
import ProductList from './deploy/ProductList';
import AuthService from './services/auth.service';
import Record from './deploy/Record';
import ToPDF from './deploy/ToPDF';
import Setting from './deploy/Setting';
import Tickets from './deploy/Tickets';
import Ticket from './deploy/Ticket';
const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let history = useHistory();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!currentUser && user) {
      setCurrentUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RouteWithLoader = ({ component: Component, ...rest }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setLoaded(true), 1000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <Route
        {...rest}
        render={props => (
          <>
            {currentUser && history.push('/dashboard')}
            <Preloader show={loaded ? false : true} /> <Component {...props} />
          </>
        )}
      />
    );
  };
  const RouteWithSidebar = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => (
          <>
            {!currentUser && history.push('/')}
            <Sidebar />

            <main className="content">
              <Navbar />
              <Component {...props} />
            </main>
          </>
        )}
      />
    );
  };

  return (
    <>
      <Switch>
        <RouteWithLoader
          exact
          path={Routes.NotFound.path}
          component={NotFoundPage}
        />
        <RouteWithLoader
          exact
          path={Routes.ServerError.path}
          component={ServerError}
        />
        {/* deploy */}
        <RouteWithLoader exact path="/" component={SignIn} />
        <RouteWithSidebar
          exact
          path={Routes.ProductList.path}
          component={ProductList}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddItem.path}
          component={AddItem}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddAdmin.path}
          component={AddAdmin}
        />
        <RouteWithSidebar
          exact
          path={Routes.AllAdmin.path}
          component={AllAdmin}
        />
        <RouteWithSidebar
          exact
          path={Routes.AllCustomer.path}
          component={AllCustomer}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          component={Setting}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          component={Setting}
        />
        <RouteWithSidebar exact path={Routes.Record.path} component={Record} />
        <RouteWithSidebar
          exact
          path={Routes.Tickets.path}
          component={Tickets}
        />
        <RouteWithSidebar
          exact
          path={Routes.TicketID.path}
          component={Ticket}
        />
        <Route exact path={Routes.ToPDF.path} component={ToPDF} />
        <Redirect to={Routes.NotFound.path} />
      </Switch>
    </>
  );
};
export default App;
