import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import About from "../components/About";
import { Form } from "../components/Form";
import { Home } from "../components/Home";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return <AppContainer>{routeResult}</AppContainer>;
}
