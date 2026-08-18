import React from 'react';

const ProductTable = ({ products, onDelete, onUpdateStock }) => {
  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 text-secondary text-uppercase small fw-bold">Product</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Category</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Price</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Stock</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Status</th>
              <th className="pe-4 py-3 text-end text-secondary text-uppercase small fw-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                {/* Image & Name */}
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <img src={item.image} alt="" className="rounded border me-3" width="40" height="40" />
                    <div>
                      <div className="fw-bold text-dark">{item.name}</div>
                      <div className="text-muted small" style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-muted small">{item.category}</td>
                <td className="fw-medium text-success">₹{item.price}</td>
                <td>
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    style={{ width: '70px' }}
                    value={item.stock}
                    onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value) || 0)}
                  />
                </td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${
                    item.stock === 0 ? 'bg-danger bg-opacity-10 text-danger' : 
                    item.stock < 20 ? 'bg-warning bg-opacity-10 text-warning' : 
                    'bg-success bg-opacity-10 text-success'
                  }`}>
                    {item.stock === 0 ? 'Unavailable' : item.stock < 20 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="pe-4 text-end">
                  <button onClick={() => onDelete(item.id)} className="btn btn-sm btn-outline-danger">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;