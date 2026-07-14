function DashboardCard({

    title,
    value

}) {

    return (

        <div className="col-md-3 mb-3">

            <div className="card shadow-sm">

                <div className="card-body">
                    <h2>{title} </h2>
                    <strong>{value}</strong>

                </div>

            </div>

        </div>
    );
}

export default DashboardCard;