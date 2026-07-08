import { useEffect, useState } from "react";

import { Modal } from "bootstrap";
import { createExpense, deleteSelected, getCustomExpenses, getExpenses, getMonthlyExpenses, getYearlyExpenses, updateExpense } from "../api/expense";
import ConfirmModal from "../components/confirm-modal";
import ExpenseForm from "../components/expense-form";
import Navbar from "../components/navbar";
import { useToast } from "../components/toast-context";
function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState({ expenseId: "", category: "", description: "", amount: "", paymentType: "", expenseDate: "" });
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentExpenses = filteredExpenses.slice(firstIndex, lastIndex);
    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / recordsPerPage));

    const today = new Date();

    const [viewType, setViewType] = useState("MONTH");
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { showToast } = useToast();


    const loadExpenses = async () => {
        let response;

        if (viewType === "MONTH") {

            response = await getMonthlyExpenses(
                currentYear,
                currentMonth
            );

        } else if (viewType === "YEAR") {

            response = await getYearlyExpenses(
                currentYear
            );

        } else {

            response = await getCustomExpenses(
                fromDate,
                toDate
            );
        }
        setSearch("");
        setCategoryFilter("");
        setPaymentFilter("");
        setExpenses(response.data);
        setFilteredExpenses(response.data);
        setSelectedExpense([]);
        setCurrentPage(1);

    };

    useEffect(() => {
        if (viewType === "CUSTOM") {
            return;
        }

        loadExpenses();

    }, [viewType, currentMonth, currentYear]);

    const addExpense = async expense => {
        await createExpense(expense);
        loadExpenses();
    };

    const openEditModal = expense => {
        setSelectedExpense({ ...expense });

        const modal = new Modal(
            document.getElementById("editExpenseModal")
        );

        modal.show();
    };

    const handleEditChange = e => {
        setSelectedExpense({
            ...selectedExpense,
            [e.target.name]: e.target.value
        });
    };


    const updateExpenseData = async () => {

        await updateExpense(selectedExpense.expenseId, selectedExpense).then(
            data => {
                showToast("Expense Management", "Expense updated successfully.", "success");
            }
        ).catch(
            error => showToast("Expense Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("editExpenseModal")
        );

        modal.hide();

        loadExpenses();
    };

        
    const openDeleteModal = (selectedExpenses) => {
        setSelectedExpense({ ...selectedExpenses });

        const modalElement = document.getElementById("openDeleteModal");

        console.log(modalElement); // Should not be null

        if (!modalElement) return;

        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    };

    const deleteSelectedData = async () => {

        await deleteSelected(selectedExpenses).then(
            data => {
                showToast("Expense Management", "Selected expenses deleted successfully.", "success");
            }
        ).catch(
            error => showToast("Expense Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("openDeleteModal")
        );

        modal.hide();
        setSelectedExpenses([]);

        loadExpenses();
    };

    const toggleSelection = expenseId => {
        setSelectedExpenses(prev =>
            prev.includes(expenseId)
                ? prev.filter(id => id !== expenseId)
                : [...prev, expenseId]
        );
    };
    const toggleSelectAll = () => {
        const currentIds = currentExpenses.map(expense => expense.expenseId);

        const allSelected = currentIds.every(id =>
            selectedExpenses.includes(id)
        );

        if (allSelected) {
            setSelectedExpenses(prev =>
                prev.filter(id => !currentIds.includes(id))
            );
        } else {
            setSelectedExpenses(prev => [
                ...new Set([...prev, ...currentIds])
            ]);
        }
    };

    const applyFilters = (
        searchValue = search,
        category = categoryFilter,
        payment = paymentFilter
    ) => {

        let data = [...expenses];

        if (searchValue.trim() !== "") {
            data = data.filter(expense =>
                (expense.description || "").toLowerCase().includes(searchValue.toLowerCase())
            );

        }

        if (category !== "") {
            data = data.filter(expense =>
                expense.category === category
            );
        }

        if (payment !== "") {
            data = data.filter(expense =>
                expense.paymentType === payment
            );
        }

        setFilteredExpenses(data);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        applyFilters(value, categoryFilter, paymentFilter);
    };

    const handleCategoryFilter = e => {
        const value = e.target.value;
        setCategoryFilter(value);
        setCurrentPage(1);
        applyFilters(search, value, paymentFilter);
    };

    const handlePaymentFilter = e => {
        const value = e.target.value;
        setPaymentFilter(value);
        setCurrentPage(1);
        applyFilters(search, categoryFilter, value);
    };

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [filteredExpenses, totalPages, currentPage]);

    const sortExpenses = field => {

        let direction = "asc";

        if (sortField === field && sortDirection === "asc") {
            direction = "desc";
        }

        setSortField(field);
        setSortDirection(direction);

        const sorted = [...filteredExpenses].sort((a, b) => {

            let valueA = a[field];
            let valueB = b[field];

            if (field === "amount") {
                return direction === "asc"
                    ? Number(valueA) - Number(valueB)
                    : Number(valueB) - Number(valueA);
            }

            if (field === "expenseDate") {
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

        setFilteredExpenses(sorted);
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

    const fetchCustom = () => {

        if (!fromDate || !toDate) {
            return;
        }

        loadExpenses();
    };

    const previous = () => {

        if (viewType === "MONTH") {

            if (currentMonth === 1) {

                setCurrentMonth(12);
                setCurrentYear(y => y - 1);

            } else {

                setCurrentMonth(m => m - 1);
            }

        } else if (viewType === "YEAR") {

            setCurrentYear(y => y - 1);
        }
    };

    const next = () => {

        const today = new Date();

        if (viewType === "MONTH") {

            if (
                currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() + 1
            ) {
                return;
            }

            if (currentMonth === 12) {

                setCurrentMonth(1);
                setCurrentYear(y => y + 1);

            } else {

                setCurrentMonth(m => m + 1);
            }

        } else {

            if (currentYear === today.getFullYear()) {
                return;
            }

            setCurrentYear(y => y + 1);
        }
    };

    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" });

    const downloadExpenseCSV = function (event) {
        const type = event.target.value;
        getExpenses(type).then((response) => {
            // 2. This block runs ONLY after the server successfully responds
            const blob = new Blob([response.data], {
                type: `application/${type}`
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            const date = new Date().toLocaleDateString();
            link.download = `expense_report_${date}.${type}`;

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
            <Navbar title="Expense Management">
            </Navbar>
            <ExpenseForm
                expense={selectedExpense}
                onSave={addExpense} />
            <div className="col-md-12 d-flex justify-content-end">
                <div className="col-md-4 pe-3 justify-content-start">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search description..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={handleCategoryFilter}>
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Investment">Investment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="HouseHold">HouseHold</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={paymentFilter}
                        onChange={handlePaymentFilter}>
                        <option value="">All Payment Types</option>
                        <option value="Cash">Cash</option>
                        <option value="Account">Account</option>
                        <option value="Card">Card</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="col-md-2 justify-content-end">
                    <button
                        className="btn btn-danger"
                        disabled={selectedExpenses.length === 0}
                        onClick={() => openDeleteModal(selectedExpenses)}>
                        Delete Selected ({selectedExpenses.length})
                    </button>
                </div>

            </div>
            <div className="row my-3 align-items-center">

                <div className="col-md-2">

                    <select
                        className="form-select"
                        value={viewType}
                        onChange={e => setViewType(e.target.value)}>

                        <option value="MONTH">Month</option>
                        <option value="YEAR">Year</option>
                        <option value="CUSTOM">Custom</option>

                    </select>

                </div>

                {viewType !== "CUSTOM" && (

                    <div className="col-md-8 text-center">

                        <button
                            className="btn btn-outline-tertiary me-2"
                            onClick={previous}>

                            ◀

                        </button>

                        <strong>

                            {viewType === "MONTH"
                                ? `${monthName} ${currentYear}`
                                : currentYear}

                        </strong>

                        <button disabled={(viewType === "YEAR" && currentYear === today.getFullYear())
                            || (viewType === "MONTH" && currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1)
                        }
                            className="btn btn-outline-tertiary ms-2"
                            onClick={next}>

                            ▶

                        </button>

                    </div>

                )}

                {viewType === "CUSTOM" && (

                    <div className="col-md-4 d-flex gap-2">

                        <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />

                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />

                        <button
                            className="btn btn-primary"
                            onClick={fetchCustom}>

                            Fetch

                        </button>

                    </div>

                )}

            </div>
            <div className={filteredExpenses.length > 15
                ? "expense-table-container mt-4"
                : "mt-4"}>
                <table
                    className=
                    "table table-bordered">

                    <thead>

                        <tr>
                            <th>
                                <input className="form-check-input"
                                    type="checkbox"
                                    checked={
                                        currentExpenses.length > 0 &&
                                        currentExpenses.every(expense =>
                                            selectedExpenses.includes(expense.expenseId)
                                        )
                                    }
                                    onChange={toggleSelectAll}
                                />

                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => sortExpenses("category")}>
                                Category {getSortIcon("category")}
                            </th>

                            <th style={{ cursor: "pointer" }} onClick={() => sortExpenses("description")}>
                                Description {getSortIcon("description")}
                            </th>

                            <th style={{ cursor: "pointer" }} onClick={() => sortExpenses("amount")}>
                                Amount {getSortIcon("amount")}
                            </th>

                            <th style={{ cursor: "pointer" }} onClick={() => sortExpenses("expenseDate")}>
                                Date {getSortIcon("expenseDate")}
                            </th>

                            <th style={{ cursor: "pointer" }} onClick={() => sortExpenses("paymentType")}>
                                Payment Type {getSortIcon("paymentType")}
                            </th>
                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {currentExpenses.length > 0 ? (
                            currentExpenses.map(
                                expense => (

                                    <tr
                                        key={
                                            expense.expenseId
                                        }>
                                        <td>
                                            <input className="form-check-input" type="checkbox"
                                                checked={selectedExpenses.includes(expense.expenseId)}
                                                onChange={() => toggleSelection(expense.expenseId)} />
                                        </td>
                                        <td>
                                            {expense.category}
                                        </td>

                                        <td>
                                            {expense.description}
                                        </td>

                                        <td>
                                            ₹{expense.amount}
                                        </td>

                                        <td>
                                            {expense.expenseDate}
                                        </td>
                                        <td>
                                            {expense.paymentType}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-info btn-sm me-3"
                                                onClick={() => openEditModal(expense)}>
                                                Edit
                                            </button>
                                          
                                        </td>
                                    </tr>
                                ))
                        ) : (<tr>
                            <td colSpan="7" className="text-center text-muted py-4">
                                <i className="bi bi-inbox fs-1"></i>
                                <br />
                                No expenses found matching your search criteria.
                            </td>
                        </tr>)
                        }
                    </tbody>

                </table>
            </div>

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
                    Showing {filteredExpenses.length === 0 ? 0 : firstIndex + 1
                    }–{Math.min(lastIndex, filteredExpenses.length)} of {filteredExpenses.length} entries
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
                <label>Download All Time Expense Report:</label>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="csv"
                    onClick={downloadExpenseCSV}
                >
                    CSV
                </button>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="pdf"
                    onClick={downloadExpenseCSV}
                >
                    PDF
                </button>

                <button
                    className="btn btn-link p-0 text-decoration-underline text-primary"
                    value="xlsx"
                    onClick={downloadExpenseCSV}
                >
                    Excel
                </button>
            </div>

            <ConfirmModal id="openDeleteModal" header="Confirm Delete" detail="Kindly confirm before deleting selected items." action={deleteSelectedData} />
            <div
                className="modal fade"
                id="editExpenseModal"
                tabIndex="-1">

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Edit Expense
                            </h5>

                            <button
                                className="btn-close"
                                data-bs-dismiss="modal">
                            </button>
                        </div>

                        <div className="modal-body">

                            <div className="mb-3">

                                <label>Category</label>

                                <select
                                    className="form-select"
                                    name="category"
                                    value={selectedExpense.category}
                                    onChange={handleEditChange}>

                                    <option value="Food">Food</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="HouseHold">HouseHold</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Other">Other</option>

                                </select>

                            </div>

                            <div className="mb-3">

                                <label>Description</label>

                                <input
                                    className="form-control"
                                    name="description"
                                    value={selectedExpense.description}
                                    onChange={handleEditChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label>Amount</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    value={selectedExpense.amount}
                                    onChange={handleEditChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label>Payment Type</label>

                                <select
                                    className="form-select"
                                    name="paymentType"
                                    value={selectedExpense.paymentType}
                                    onChange={handleEditChange}>
                                    <option value="Cash">Cash</option>
                                    <option value="Account">Account</option>
                                    <option value="Card">Card</option>
                                    <option value="Other">Other</option>

                                </select>

                            </div>

                            <div className="mb-3">

                                <label>Expense Date</label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="expenseDate"
                                    value={selectedExpense.expenseDate}
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
                                onClick={updateExpenseData}>

                                Update

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Expenses;