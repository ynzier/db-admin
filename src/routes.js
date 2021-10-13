export const Routes = {
  // pages
  Lock: { path: '/dashboard/examples/lock' },
  NotFound: { path: '/dashboard/examples/404' },
  ServerError: { path: '/dashboard/examples/500' },

  // deployment
  Signin: { path: '/' },
  ProductList: { path: '/dashboard' },
  AddAdmin: { path: '/dashboard/addadmin' },
  AllAdmin: { path: '/dashboard/alladmin' },
  AllCustomer: { path: '/dashboard/allItem' },
  AddItem: { path: '/dashboard/additem' },
  Setting: { path: '/dashboard/setting' },
  Record: { path: '/record/:id' },
  ToPDF: { path: '/print/:id' },
  Tickets: { path: '/dashboard/tickets' },
  TicketID: { path: '/ticket/:id' },
};
