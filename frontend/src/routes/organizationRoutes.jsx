// import OrganizationApplications from '@/modules/dashboard/organization/pages/OrganizationApplications';

// const organizationRoutes = [
//   {
//     path: '/organization/applications',
//     element: <OrganizationApplications />,
//   },
//   {
//     path: '/organization/dashboard',
//     element: <OrganizationDashboard />,
//   },
//   {
//     path: '/organization/payments',
//     element: <OrganizationPayments />,
//   },
// ];

// export default organizationRoutes;
import OrganizationDashboard from '@/modules/dashboard/organization/pages/OrganizationDashboard';
import OrganizationApplications from '@/modules/dashboard/organization/pages/OrganizationApplications';
import OrganizationPayments from '@/modules/dashboard/organization/pages/OrganizationPayments';

const organizationRoutes = [
  {
    path: '/organization/dashboard',
    element: <OrganizationDashboard />,
  },
  {
    path: '/organization/applications',
    element: <OrganizationApplications />,
  },
  {
    path: '/organization/payments',
    element: <OrganizationPayments />,
  },
];

export default organizationRoutes;
