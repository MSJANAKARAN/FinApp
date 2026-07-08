function ConfirmModal({ id, header, detail, action }) {
    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1">

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            {header}
                        </h5>

                        <button
                            className="btn-close"
                            data-bs-dismiss="modal">
                        </button>
                    </div>

                    <div className="modal-body">
                        <label>{detail}</label>
                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            data-bs-dismiss="modal">

                            Cancel

                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={action}>

                            Confirm

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}
export default ConfirmModal;