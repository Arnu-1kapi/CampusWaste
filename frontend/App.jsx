import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
const [showAddForm, setShowAddForm] = useState(false);
const [editingBin, setEditingBin] = useState(null);
const [formData, setFormData] = useState({
  binCode: "",
  binName: "",
  location: "",
  wasteType: "",
  capacityLitres: "",
  status: "active"
});
const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value
    });
};

const handleAddBin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(
    editingBin
        ? `http://localhost:5000/api/waste-bins/code/${editingBin.binCode}`
        : "http://localhost:5000/api/waste-bins",
    {
            method: editingBin ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
    ...formData,
    capacity: Number(formData.capacityLitres)
})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not add waste bin");
        }

        if (editingBin) {
    setBins((previousBins) =>
        previousBins.map((bin) =>
            bin._id === data._id ? data : bin
        )
    );
} else {
    setBins((previousBins) => [...previousBins, data]);
}
        setShowAddForm(false);
        setEditingBin(null);

        setFormData({
            binCode: "",
            binName: "",
            location: "",
            wasteType: "",
            capacityLitres: "",
            status: "active"
        });

        alert(editingBin ? "Waste bin updated successfully!" : "Waste bin added successfully!");
    } catch (error) {
        alert(error.message);
    }
};
const handleEditBin = (bin) => {
    setEditingBin(bin);
    setFormData({
        binCode: bin.binCode || "",
        binName: bin.binName || "",
        location: bin.location || "",
        wasteType: bin.wasteType || "",
        capacityLitres: bin.capacityLitres || bin.capacity || "",
        status: bin.status || "active"
    });
    setShowAddForm(true);
};
const handleDeleteBin = async (binCode) => {
    if (!window.confirm(`Are you sure you want to delete ${binCode}?`)) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/waste-bins/code/${binCode}`,
            { method: "DELETE" }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not delete waste bin");
        }

        setBins((previousBins) =>
            previousBins.filter((bin) => bin.binCode !== binCode)
        );

        alert("Waste bin deleted successfully!");
    } catch (error) {
        alert(error.message);
    }
};
  useEffect(() => {
    fetch("http://localhost:5000/api/waste-bins")
      .then((response) => response.json())
      .then((data) => {
        setBins(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading waste bins:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>♻ CampusWaste</h2>

        <nav>
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#bins">Waste Bins</a>
          <a href="#collections">Collections</a>
          <a href="#reports">Waste Reports</a>
          <a href="#users">Users</a>
        </nav>

        <div className="sidebar-footer">
          CampusWaste Management
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to CampusWaste Management System</p>
          </div>
          <div className="admin">Administrator</div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <h3>Total Waste Bins</h3>
            <p>{bins.length}</p>
          </div>

          <div className="stat-card">
            <h3>Active Bins</h3>
            <p>{bins.filter((bin) => bin.status?.toLowerCase() === "active").length}</p>
          </div>

          <div className="stat-card">
            <h3>Waste Categories</h3>
            <p>4</p>
          </div>

          <div className="stat-card">
            <h3>Collections</h3>
            <p>0</p>
          </div>
        </section>

        <section className="table-section" id="bins">
          <div className="section-heading">
            <div>
              <h2>Waste Bin Management</h2>
              <p>View and manage campus waste bins.</p>
            </div>

            <button
  className="add-button"
  onClick={() => setShowAddForm(true)}
>
  + Add Waste Bin
</button>
          </div>
          {showAddForm && (
  <div className="form-container">
    <h3>{editingBin ? "Edit Waste Bin" : "Add New Waste Bin"}</h3>

    <form onSubmit={handleAddBin}>
    

    <input
        type="text"
        placeholder="Bin Code"
        value={formData.binCode}
        onChange={(e) => setFormData({...formData, binCode: e.target.value})}
        required
    />

    <input
        type="text"
        placeholder="Bin Name"
        value={formData.binName}
        onChange={(e) => setFormData({...formData, binName: e.target.value})}
        required
    />

    <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
        required
    />

    <input
        type="text"
        placeholder="Waste Type"
        value={formData.wasteType}
        onChange={(e) => setFormData({...formData, wasteType: e.target.value})}
        required
    />

    <input
        type="number"
        placeholder="Capacity (Litres)"
        value={formData.capacityLitres}
        onChange={(e) => setFormData({...formData, capacityLitres: e.target.value})}
        required
    />

    <button type="submit">
    {editingBin ? "Update Waste Bin" : "Save Waste Bin"}
</button>

    <button type="button" onClick={() => setShowAddForm(false)}>
        Cancel
    </button>
</form>
  </div>
)}

          {loading ? (
            <p>Loading waste bins...</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Bin Code</th>
                    <th>Bin Name</th>
                    <th>Location</th>
                    <th>Waste Type</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bins.length > 0 ? (
                    bins.map((bin) => (
                      <tr key={bin._id}>
                        <td>{bin.binCode || "—"}</td>
                        <td>{bin.binName}</td>
                        <td>{bin.location}</td>
                        <td>{bin.wasteType}</td>
                        <td>{bin.capacity} L</td>
                        <td>
                          <span className="status">
                            {bin.status}
                          </span>
                        </td>
                        <td>
    <button onClick={() => handleEditBin(bin)}>
        Edit
    </button>
    <button onClick={() => handleDeleteBin(bin.binCode)}>
    Delete
</button>
</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No waste bins found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;