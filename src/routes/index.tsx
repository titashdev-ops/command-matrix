import { createFileRoute } from "@tanstack/react-router";
import PortfolioApp from "../App.jsx";

export const Route = createFileRoute("/")({
  component: PortfolioApp,
});
