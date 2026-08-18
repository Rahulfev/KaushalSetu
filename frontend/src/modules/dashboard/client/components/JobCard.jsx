const JobCard = ({ job }) => {
  return (
    <div className="border p-3 rounded mb-2">
      <p><b>{job.title}</b></p>
      <p>{job.category}</p>
      <p>Status: {job.status}</p>
    </div>
  );
};

export default JobCard;
