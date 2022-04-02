import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import About from "../components/About";
import { Form } from "../components/Form";
import { FormPreview } from "../components/FormPreview";
import { Home } from "../components/Home";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms/:id": ({ id }: { id: string }) => <Form id={Number(id)} />,
  "/preview/:id": ({ id }: { id: string }) => <FormPreview id={Number(id)} />,
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return <AppContainer>{routeResult}</AppContainer>;
}
