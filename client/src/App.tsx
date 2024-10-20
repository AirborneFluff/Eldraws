import {
  createBrowserRouter,
  redirect, RouterProvider,
} from 'react-router-dom';
import { AppLayout } from './core/ui/AppLayout.tsx';
import { performLogout } from './data/services/api/auth-api.ts';
import { AppDispatch, store } from './data/store.ts';
import { LoginPage } from './features/login/LoginPage.tsx';
import { LoadingPage } from './components/LoadingPage.tsx';
import { loginUser } from './data/slices/userSlice.ts';
import { GuildsPage } from './features/guilds/GuildsPage.tsx';
import { GuildDetailsPage } from './features/guilds/GuildDetailsPage.tsx';
import {EventDetailsPage} from "./features/events/EventDetailsPage.tsx";
import {CreateEventPage} from "./features/events/CreateEventPage.tsx";
import { ManageGuildTilesPage } from './features/guilds/ManageGuildTilesPage.tsx';
import { AccountDetailsPage } from './features/account/AccountDetailsPage.tsx';

const logoutAction = async () => {
  const dispatch = store.dispatch;
  console.log("logging out")
  await performLogout(dispatch)();
  console.log("redirecting")
  return redirect('/');
};

const checkUserSetupLoader = async () => {
  const dispatch: AppDispatch = store.dispatch;
  try {
    await dispatch(loginUser());
    const user = store.getState().user.user;

    if (user == null) {
      return redirect("/login");
    }

    if (user.gamertag === '') {
      console.log("Going to setup")
      return redirect("/account-setup");
    }

    return null;
  } catch (error) {
    console.error("Error checking user:", error);
    return redirect("/");
  }
};

const checkUserLoader = async () => {
  const dispatch: AppDispatch = store.dispatch;
  try {
    await dispatch(loginUser());
    const user = store.getState().user.user;

    if (user == null) {
      return redirect("/login");
    }

    if (user.gamertag !== '') {
      return redirect("/app");
    }

    return null;
  } catch (error) {
    console.error("Error checking user:", error);
    return redirect("/");
  }
};

const router = createBrowserRouter([
  {
    index: true,
    loader: () => redirect('/app')
  },
  {
    path: "/login",
    Component: LoginPage
  },
  {
    path: "/account-setup",
    loader: checkUserLoader,
    Component: AccountDetailsPage
  },
  {
    path: "/app",
    loader: checkUserSetupLoader,
    Component: AppLayout,
    children: [
      {
        index: true,
        loader: () => redirect('/app/guilds')
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
            Component: GuildDetailsPage
          },
          {
            path: ":guildId/events/create",
            Component: CreateEventPage
          },
          {
            path: ":guildId/tiles",
            Component: ManageGuildTilesPage
          }
        ]
      },
      {
        path: "events",
        children: [
          {
            path: ":eventId",
            Component: EventDetailsPage
          }
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