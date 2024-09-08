import {
  createBrowserRouter,
  redirect, RouterProvider,
} from 'react-router-dom';
import { AppLayout } from './core/ui/AppLayout.tsx';
import { performGetUser, performLogout } from './data/services/api/auth-api.ts';
import { store } from './data/store.ts';
import { LoginPage } from './features/login/LoginPage.tsx';
import { HomePage } from './features/home/HomePage.tsx';
import { LoadingPage } from './components/LoadingPage.tsx';

const logoutAction = async () => {
  const dispatch = store.dispatch;
  console.log("logging out")
  await performLogout(dispatch)();
  console.log("redirecting")
  return redirect('/');
};

const checkUserLoader = async () => {
  const dispatch = store.dispatch;
  const user = await performGetUser(dispatch)();
  console.log(user)
  if (user == null) return redirect("/")

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage
  },
  {
    path: "/app",
    loader: checkUserLoader,
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<LoadingPage />} />
  );
}