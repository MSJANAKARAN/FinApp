import PortFolioForm from "../components/portfolio-form";
import { useEffect, useState } from "react";
import { getPortfolioHoldings } from "../api/portfolio";
import { useToast } from "../components/toast-context";
import { Modal } from "bootstrap";

function PortfolioHolding() {

    const [portfolio, setPortfolio] = useState([]);
    const [selectedPortfolios, setSelectedPortfolios] = useState([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedPortfolio, setSelectedPortfolio] = useState({ symbol: "", companyName: "", quantity: "", averagePrice: "", investedAmount: "" });
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentPortfolios = filteredPortfolios.slice(firstIndex, lastIndex);
    const totalPages = Math.max(1, Math.ceil(filteredPortfolios.length / recordsPerPage));

    const { showToast } = useToast();


    const loadPortfolio = async () => {
        let response = await getPortfolioHoldings();

        setSearch("");
        setPortfolio(response.data);
        setFilteredPortfolios(response.data);
        setSelectedPortfolio([]);
        setCurrentPage(1);
    };

    useEffect(() => {
        loadPortfolio();
    }, []);

    const openEditModal = portfolio => {
        setSelectedPortfolio({ ...portfolio });

        const modal = new Modal(
            document.getElementById("editPortfolioModal")
        );

        modal.show();
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);

        let data = [...currentPortfolios];

        if (value.trim() !== "") {
            data = data.filter(portfolio =>
                (portfolio.symbol || "").toLowerCase().includes(value.toLowerCase()) ||
                (portfolio.companyName || "").toLowerCase().includes(value.toLowerCase())
            );
        }
                setFilteredPortfolios(data);

    };


    const sortPortfolio = field => {

        let direction = "asc";

        if (sortField === field && sortDirection === "asc") {
            direction = "desc";
        }

        setSortField(field);
        setSortDirection(direction);

        const sorted = [...currentPortfolios].sort((a, b) => {

            let valueA = a[field];
            let valueB = b[field];

            if (field === "quantity" || field === "averagePrice" || field === "investedAmount") {
                return direction === "asc"
                    ? Number(valueA) - Number(valueB)
                    : Number(valueB) - Number(valueA);
            }

            valueA = valueA?.toString().toLowerCase();
            valueB = valueB?.toString().toLowerCase();

            if (direction === "asc") {
                return valueA.localeCompare(valueB);
            }

            return valueB.localeCompare(valueA);
        });

        setFilteredPortfolios(sorted);
        setCurrentPage(1);
    };

    const getSortIcon = field => {

        if (sortField !== field) {
            return <i className="bi bi-arrow-down-up ms-1"></i>;
        }

        return sortDirection === "asc"
            ? <i className="bi bi-sort-alpha-down ms-1"></i>
            : <i className="bi bi-sort-alpha-up ms-1"></i>;
    };


    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = page => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {

        const pages = [];

        if (totalPages <= 7) {

            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

        } else {

            if (currentPage <= 4) {

                pages.push(1, 2, 3, 4, 5, "...", totalPages);

            } else if (currentPage >= totalPages - 3) {

                pages.push(
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );

            } else {

                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages.map((page, index) => {

            if (page === "...") {
                return (
                    <li
                        key={`dots-${index}`}
                        className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            return (
                <li
                    key={page}
                    className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => goToPage(page)}>
                        {page}
                    </button>
                </li>
            );
        });
    };

    const stablePortfolio = currentPortfolios.map((item, index) => ({
        ...item, stableId: `row-${index}`
    }));

    return (

        <div className="container mt-4">
            <div className="col-md-12 d-flex justify-content-end">
                <div className="col-md-4 pe-3 justify-content-start">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Symbol,Company Name..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <table
                className=
                "table table-bordered mt-3">

                <thead>
                    <tr>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("symbol")}>
                            Symbol {getSortIcon("symbol")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("companyName")}>
                            Company Name {getSortIcon("companyName")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("quantity")}>
                            Quantity {getSortIcon("quantity")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("averagePrice")}>
                            Average Price {getSortIcon("averagePrice")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("investedAmount")}>
                            Quantity {getSortIcon("investedAmount")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stablePortfolio.map((item) => (
                        <tr key={item.stableId}>
                            <td>{item.symbol}</td>
                            <td>{item.companyName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.averagePrice}</td>
                            <td>{item.investedAmount}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <div className="d-flex align-items-center mt-3">
                <div className="col-md-1 justify-content-start">

                    <select
                        className="form-select w-auto"
                        value={recordsPerPage}
                        onChange={e => {
                            setRecordsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>

                    </select>
                </div>
                <div className="col-md-3">
                    Showing {filteredPortfolios.length === 0 ? 0 : firstIndex + 1
                    }–{Math.min(lastIndex, filteredPortfolios.length)} of {filteredPortfolios.length} entries
                </div>

                <nav className="col-md-8">
                    <ul className="pagination mb-0 justify-content-end">

                        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={previousPage}>
                                Previous
                            </button>
                        </li>

                        {renderPageNumbers()}

                        <li className={`page-item ${currentPage >= totalPages || totalPages === 0 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={nextPage}>
                                Next
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>

        </div>
    )
}

export default PortfolioHolding;