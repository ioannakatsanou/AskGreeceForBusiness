import { EmptyState } from "../components/feedback/States.jsx";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <EmptyState
      icon="🧭"
      title="Page not found"
      message="The page you're looking for doesn't exist."
      action={<Button to="/">Back to home</Button>}
    />
  );
}
