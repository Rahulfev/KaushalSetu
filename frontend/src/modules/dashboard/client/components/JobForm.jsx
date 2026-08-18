const JobForm = ({ form, onChange, onSubmit }) => {
  return (
    <div className="border p-4 rounded shadow">
      {["title", "category", "budget", "duration", "location","District"].map(f => (
        <input
          key={f}
          className="border p-2 w-full mb-2"
          name={f}
          placeholder={f.toUpperCase()}
          onChange={onChange}
        />
      ))}

      <textarea
        className="border p-2 w-full"
        name="description"
        placeholder="Job Description"
        onChange={onChange}
      />

      <button
        onClick={onSubmit}
        className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
      >
        Post Job
      </button>
    </div>
  );
};

export default JobForm;
