import Nav from "./components/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
