import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2 col-md-3 p-0">
                        <Sidebar />
                    </div>
                    <div className="col-lg-10 col-md-9 p-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Layout;