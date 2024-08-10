import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <div>
      <h1>Other</h1>
      <Link to="/" className="underline">
        Home
      </Link>
    </div>
  );
}
