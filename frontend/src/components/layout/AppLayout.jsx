import Aurora from "./Aurora";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./layout.css";

// The shell every page sits in: aurora backdrop, header / tab bar, page
// content and (optionally) the footer.
function AppLayout({ className = "", withFooter = false, children }) {
  return (
    <div className="app">
      <Aurora />
      <Navbar />
      <main className={`app-main ${className}`}>{children}</main>
      {withFooter && <Footer />}
    </div>
  );
}

export default AppLayout;
