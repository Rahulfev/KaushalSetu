package com.kaushalsetu.modules.job.service;

import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.job.dto.CreateJobRequest;
import com.kaushalsetu.modules.job.dto.JobResponse;
import com.kaushalsetu.modules.job.repository.ClientJobRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.common.enums.JobStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientJobService {

    private final ClientJobRepository clientJobRepository;
    private final UserRepository userRepository;

    public JobResponse createJob(CreateJobRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validate(request);

        Job job = Job.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                // Intentionally no budget — the client does not set a price when posting.
                .serviceAddress(request.getServiceAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .landmark(request.getLandmark())
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .additionalNotes(request.getAdditionalNotes())
                .contactPreference(request.getContactPreference() != null ? request.getContactPreference() : "PHONE_CALL")
                .status(JobStatus.OPEN)
                .postedByUserId(user.getUserId())
                // Also mirror onto the shared location/district columns so this job shows up
                // in the worker's job feed, which filters by district (see JobController.getJobFeed).
                .location(request.getServiceAddress())
                .district(normalizeDistrict(request.getCity()))
                .build();

        return map(clientJobRepository.save(job));
    }

    /**
     * Best-effort match of a free-text city name (e.g. "Pune", "mumbai city") to the
     * District enum used by the worker job feed's filter (e.g. "PUNE", "MUMBAI_CITY").
     * Returns null if there's no match — the job simply won't appear in a district-filtered
     * feed in that case, but will still show up when no district filter is applied.
     */
    private String normalizeDistrict(String city) {
        if (isBlank(city)) return null;
        String candidate = city.trim().toUpperCase().replaceAll("[^A-Z]+", "_").replaceAll("^_+|_+$", "");
        for (com.kaushalsetu.common.enums.District d : com.kaushalsetu.common.enums.District.values()) {
            if (d.name().equals(candidate)) return d.name();
        }
        return null;
    }

    private void validate(CreateJobRequest r) {
        if (isBlank(r.getServiceAddress())) throw new ApiException("Service address is required");
        if (isBlank(r.getCity())) throw new ApiException("City is required");
        if (isBlank(r.getState())) throw new ApiException("State is required");
        if (r.getPreferredDate() == null) throw new ApiException("Preferred service date is required");
        if (isBlank(r.getPreferredTime())) throw new ApiException("Preferred service time is required");
        if (r.getPincode() != null && !r.getPincode().isBlank() && !r.getPincode().matches("^[1-9][0-9]{5}$")) {
            throw new ApiException("Enter a valid 6-digit PIN code");
        }
    }

    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    public List<JobResponse> getJobsByClient(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return clientJobRepository
                .findByPostedByUserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    public void deleteJob(Integer jobId, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = clientJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedByUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (job.getStatus() != JobStatus.OPEN) {
            throw new ApiException("Only an open job with no assigned worker can be deleted. Cancel it instead.");
        }

        clientJobRepository.delete(job);
    }

    /** CLIENT: cancel a job — allowed any time before it's PAID/CLOSED. */
    public void cancelJob(Integer jobId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = clientJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedByUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (job.getStatus() == JobStatus.COMPLETED) {
            throw new ApiException("This job is already completed and can't be cancelled.");
        }

        job.setStatus(JobStatus.CANCELLED);
        clientJobRepository.save(job);
    }

    public JobResponse updateJob(Integer jobId, CreateJobRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = clientJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedByUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (job.getStatus() != JobStatus.OPEN) {
            throw new ApiException("This job can no longer be edited — a worker is already assigned.");
        }

        validate(request);

        job.setTitle(request.getTitle());
        job.setCategory(request.getCategory());
        job.setDescription(request.getDescription());
        job.setServiceAddress(request.getServiceAddress());
        job.setCity(request.getCity());
        job.setState(request.getState());
        job.setPincode(request.getPincode());
        job.setLandmark(request.getLandmark());
        job.setPreferredDate(request.getPreferredDate());
        job.setPreferredTime(request.getPreferredTime());
        job.setAdditionalNotes(request.getAdditionalNotes());
        if (request.getContactPreference() != null) job.setContactPreference(request.getContactPreference());
        job.setLocation(request.getServiceAddress());
        job.setDistrict(normalizeDistrict(request.getCity()));

        return map(clientJobRepository.save(job));
    }

    private JobResponse map(Job job) {

        JobResponse response = new JobResponse();
        response.setJobId(job.getJobId());
        response.setTitle(job.getTitle());
        response.setCategory(job.getCategory());
        response.setDescription(job.getDescription());
        response.setBudget(job.getBudget());
        response.setLocation(job.getLocation());
        response.setDistrict(job.getDistrict());
        response.setStatus(job.getStatus());
        response.setServiceAddress(job.getServiceAddress());
        response.setCity(job.getCity());
        response.setState(job.getState());
        response.setPincode(job.getPincode());
        response.setLandmark(job.getLandmark());
        response.setPreferredDate(job.getPreferredDate());
        response.setPreferredTime(job.getPreferredTime());
        response.setAdditionalNotes(job.getAdditionalNotes());
        response.setContactPreference(job.getContactPreference());
        response.setPostedByUserId(job.getPostedByUserId());
        response.setCreatedAt(job.getCreatedAt());

        return response;
    }
}
