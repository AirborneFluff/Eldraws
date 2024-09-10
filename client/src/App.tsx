import {
  createBrowserRouter,
  redirect, RouterProvider,
} from 'react-router-dom';
import { AppLayout } from './core/ui/AppLayout.tsx';
import { performLogout } from './data/services/api/auth-api.ts';
import { AppDispatch, store } from './data/store.ts';
import { LoginPage } from './features/login/LoginPage.tsx';
import { HomePage } from './features/home/HomePage.tsx';
import { LoadingPage } from './components/LoadingPage.tsx';
import { loginUser } from './data/slices/userSlice.ts';
import { GuildsPage } from './features/guilds/GuildsPage.tsx';
import { ManageGuildPage } from './features/guilds/ManageGuildPage.tsx';

const logoutAction = async () => {
  const dispatch = store.dispatch;
  console.log("logging out")
  await performLogout(dispatch)();
  console.log("redirecting")
  return redirect('/');
};

const checkUserLoader = async () => {
  const dispatch: AppDispatch = store.dispatch;
  try {
    await dispatch(loginUser());
    const user = store.getState().user.user;

    if (user == null) {
      return redirect("/");
    }
    return null;
  } catch (error) {
    console.error("Error checking user:", error);
    return redirect("/");
  }
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
      {
        path: "guilds",
        children: [
          {
            index: true,
            Component: GuildsPage
          },
          {
            path: ":guildId",
            Component: ManageGuildPage
          },
        ]
      }
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