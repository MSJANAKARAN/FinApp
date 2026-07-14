import PortFolioForm from "../components/portfolio-form";
import { useEffect, useState } from "react";
import { addTransaction, updateTransaction, deleteSelected, getPortfolioTransactions, getPortfolioDetails } from "../api/portfolio";
import Navbar from "../components/navbar";
import { useToast } from "../components/toast-context";
import { Modal } from "bootstrap";
import ConfirmModal from "../components/confirm-modal";
import PortfolioHolding from "./portfolio-holding";
function Portfolio() {

    const [portfolio, setPortfolio] = useState([]);
    const [selectedPortfolios, setSelectedPortfolios] = useState([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState([]);
    const [search, setSearch] = useState("");
    const [assetFilter, setAssetFilter] = useState("");
    const [transactionFilter, setTransactionFilter] = useState("");
    const [selectedPortfolio, setSelectedPortfolio] = useState({ transactionId: "", symbol: "", companyName: "", assetType: "", transactionType: "", quantity: "", price: "", transactionDate: "" });
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentPortfolios = filteredPortfolios.slice(firstIndex, lastIndex);
    const totalPages = Math.max(1, Math.ceil(filteredPortfolios.length / recordsPerPage));

    const { showToast } = useToast();

    const addPortfolio = async portfolio => {
        await addTransaction(portfolio);
        loadPortfolio();
    };

    const loadPortfolio = async () => {
        let response = await getPortfolioTransactions();
        setSearch("");
        setAssetFilter("");
        setTransactionFilter("");
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

    const updatePortfolioData = async () => {
        const requiredFields = ["transactionId", "symbol", "companyName", "assetType",
            "transactionType", "quantity", "price"];

        const emptyField = requiredFields.find(field => !selectedPortfolio[field]?.toString().trim());

        if (emptyField || !isValidDateString(selectedPortfolio?.transactionDate)) {
            return showToast("Portfolio Management", "Portfolio field cannot be empty/invalid.", "info");
        }

        await updateTransaction(selectedPortfolio.transactionId, selectedPortfolio).then(
            data => {
                showToast("Portfolio Management", "Portfolio updated successfully.", "success");
            }
        ).catch(
            error => showToast("Portfolio Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("editPortfolioModal")
        );

        modal.hide();

        loadPortfolio();
    };

    function isValidDateString(dateValue) {
        if (!dateValue || !dateValue.toString().trim()) {
            return false;
        }

        const parsedDate = new Date(dateValue);

        return !Number.isNaN(parsedDate.getTime());
    }

    const handleEditChange = e => {
        setSelectedPortfolio({
            ...selectedPortfolio,
            [e.target.name]: e.target.value
        });
    };

    const openDeleteModal = (selectedPortfolios) => {
        setSelectedPortfolio({ ...selectedPortfolios });

        const modalElement = document.getElementById("openDeleteModal");

        console.log(modalElement);

        if (!modalElement) return;

        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    };

    const deleteSelectedData = async () => {

        await deleteSelected(selectedPortfolios).then(
            data => {
                showToast("Portfolio Management", "Selected portfolios deleted successfully.", "success");
            }
        ).catch(
            error => showToast("Portfolio Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("openDeleteModal")
        );

        modal.hide();
        setSelectedPortfolios([]);
        loadPortfolio();
    };


    const toggleSelection = transactionId => {
        setSelectedPortfolios(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };
    const toggleSelectAll = () => {
        const currentIds = currentPortfolios.map(portfolio => portfolio.transactionId);

        const allSelected = currentIds.every(id =>
            selectedPortfolios.includes(id)
        );

        if (allSelected) {
            setSelectedPortfolios(prev =>
                prev.filter(id => !currentIds.includes(id))
            );
        } else {
            setSelectedPortfolios(prev => [
                ...new Set([...prev, ...currentIds])
            ]);
        }
    };

    const applyFilters = (
        searchValue = search,
        assetType = assetFilter,
        transactionType = transactionFilter
    ) => {

        let data = [...portfolio];

        if (searchValue.trim() !== "") {
            data = data.filter(portfolio =>
                (portfolio.symbol || "").toLowerCase().includes(searchValue.toLowerCase()) ||
                (portfolio.companyName || "").toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (assetType !== "") {
            data = data.filter(portfolio =>
                portfolio.assetType === assetType
            );
        }

        if (transactionType !== "") {
            data = data.filter(portfolio =>
                portfolio.transactionType === transactionType
            );
        }

        setFilteredPortfolios(data);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        applyFilters(value, assetFilter, transactionFilter);
    };

    const handleAssetFilter = e => {
        const value = e.target.value;
        setAssetFilter(value);
        setCurrentPage(1);
        applyFilters(search, value, transactionFilter);
    };

    const handleTransactionFilter = e => {
        const value = e.target.value;
        setTransactionFilter(value);
        setCurrentPage(1);
        applyFilters(search, assetFilter, value);
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

            if (field === "quantity" || field === "price") {
                return direction === "asc"
                    ? Number(valueA) - Number(valueB)
                    : Number(valueB) - Number(valueA);
            }

            if (field === "transactionDate") {
                return direction === "asc"
                    ? new Date(valueA) - new Date(valueB)
                    : new Date(valueB) - new Date(valueA);
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

    const downloadPortfolioReport = function (event) {
        const type = event.target.value;
        getPortfolioDetails(type).then((response) => {
            const mimeTypes = {
                pdf: "application/pdf",
                csv: "text/csv",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            const blob = new Blob([response.data], {
                type: mimeTypes[type]
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            const date = new Date().toISOString().split("T")[0];
            link.download = `portfolio_report_${date}.${type}`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error("Download failed:", error);
        });
    }
    return (


        <div className="container mt-4">

            <Navbar title="Portfolio Management">
            </Navbar>
            <PortfolioHolding></PortfolioHolding>
            < PortFolioForm portfolio={selectedPortfolio} onSave={addPortfolio} />

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
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={assetFilter}
                        onChange={handleAssetFilter}>
                        <option value="">All Assets</option>
                        <option value="Stock">Stock</option>
                        <option value="Bond">Bond</option>
                        <option value="Mutual Fund">Mutual Fund</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={transactionFilter}
                        onChange={handleTransactionFilter}>
                        <option value="">All Transaction Types</option>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </select>
                </div>
                <div className="col-md-2 justify-content-end">
                    <button
                        className="btn btn-danger"
                        disabled={selectedPortfolios.length === 0}
                        onClick={() => openDeleteModal(selectedPortfolios)}>
                        Delete Selected ({selectedPortfolios.length})
                    </button>
                </div>
            </div>

            <table
                className=
                "table table-bordered mt-3">

                <thead>

                    <tr>
                        <th>
                            <input className="form-check-input"
                                type="checkbox"
                                checked={
                                    currentPortfolios.length > 0 &&
                                    currentPortfolios.every(portfolio =>
                                        selectedPortfolios.includes(portfolio.transactionId)
                                    )
                                }
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("symbol")}>
                            Symbol {getSortIcon("symbol")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("companyName")}>
                            Company Name {getSortIcon("companyName")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("assetType")}>
                            Asset Type {getSortIcon("assetType")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("transactionType")}>
                            Transaction Type {getSortIcon("transactionType")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("quantity")}>
                            Quantity {getSortIcon("quantity")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("price")}>
                            Price {getSortIcon("price")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("transactionDate")}>
                            Date {getSortIcon("transactionDate")}
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {currentPortfolios.length > 0 ? (
                        currentPortfolios.map(
                            portfolio => (

                                <tr
                                    key={
                                        portfolio.transactionId
                                    }>
                                    <td>
                                        <input className="form-check-input" type="checkbox"
                                            checked={selectedPortfolios.includes(portfolio.transactionId)}
                                            onChange={() => toggleSelection(portfolio.transactionId)} />
                                    </td>
                                    <td>
                                        {portfolio.symbol}
                                    </td>

                                    <td>
                                        {portfolio.companyName}
                                    </td>
                                    <td>
                                        {portfolio.assetType}
                                    </td>
                                    <td>
                                        {portfolio.transactionType}
                                    </td>
                                    <td>
                                        {portfolio.quantity}
                                    </td>
                                    <td>
                                        ₹{portfolio.price}
                                    </td>

                                    <td>
                                        {portfolio.transactionDate}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-3"
                                            onClick={() => openEditModal(portfolio)}>
                                            Edit
                                        </button>

                                    </td>
                                </tr>
                            ))
                    ) : (<tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                            <i className="bi bi-inbox fs-1"></i>
                            <br />
                            No portfolio found matching your search criteria.
                        </td>
                    </tr>)
                    }
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

                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>

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

            <div className="d-flex my-3 align-items-center gap-3">
                <label>Download All Time Portfolio Report:</label>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="csv"
                    onClick={downloadPortfolioReport}
                >
                    CSV
                </button>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="pdf"
                    onClick={downloadPortfolioReport}
                >
                    PDF
                </button>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="xlsx"
                    onClick={downloadPortfolioReport}
                >
                    Excel
                </button>
            </div>
            <ConfirmModal id="openDeleteModal" header="Confirm Delete" detail="Kindly confirm before deleting selected items." action={deleteSelectedData} />
            <div
                className="modal fade"
                id="editPortfolioModal"
                tabIndex="-1">

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Edit Portfolio
                            </h5>
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal">
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label>Transaction Date</label>
                                <input
                                    type="date"
                                    name="transactionDate"
                                    className="form-control"
                                    value={selectedPortfolio.transactionDate}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Symbol</label>
                                <input
                                    name="symbol"
                                    className="form-control"
                                    value={selectedPortfolio.symbol}
                                    onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Company Name</label>
                                <input
                                    name="companyName"
                                    className="form-control"
                                    value={selectedPortfolio.companyName}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Asset Type</label>
                                <select
                                    name="assetType"
                                    className="form-control"
                                    value={selectedPortfolio.assetType}
                                    onChange={handleEditChange}>
                                    <option value="Stock">Stock</option>
                                    <option value="Bond">Bond</option>
                                    <option value="Mutual Fund">Mutual Fund</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Transaction Type</label>
                                <select
                                    name="transactionType"
                                    className="form-control"
                                    value={selectedPortfolio.transactionType}
                                    onChange={handleEditChange}>
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className="form-control"
                                    value={selectedPortfolio.quantity}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    value={selectedPortfolio.price}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal">
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={updatePortfolioData}>
                                Update
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Portfolio;