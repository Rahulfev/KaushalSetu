const ProfileForm = ({ form, onChange, onSubmit, kyc }) => {
  return (
    <div className="border p-4 rounded shadow">
      {["name", "email", "mobile", "district", "bankAccount"].map(field => (
        <input
          key={field}
          className="border p-2 w-full mb-2"
          name={field}
          placeholder={field.toUpperCase()}
          value={form[field]}
          onChange={onChange}
        />
      ))}

      <p className="text-sm">
        KYC Status:
        <b className={kyc ? "text-green-600" : "text-red-600"}>
          {kyc ? " Verified" : " Pending"}
        </b>
      </p>

      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
      >
        Update Profile
      </button>
    </div>
  );
};

export default ProfileForm;
