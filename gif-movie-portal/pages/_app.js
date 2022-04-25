import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <main>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Platzi Movies</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 link-menu">Inicio</a>
            </Link>
            <Link href="/add-movie">
              <a className="mr-6 link-menu">Agregar Películas</a>
            </Link>
            <Link href="/my-movies">
              <a className="mr-6 link-menu">Mis Películas</a>
            </Link>
          </div>
        </nav>
      </main>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
