package com.kaushalsetu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sub_id")
	private Long subId;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "plan_name")
	private String planName;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "expiry_date")
	private LocalDate expiryDate;

	private String status; // 'ACTIVE', 'EXPIRED'

	// Getters and Setters
	public Long getSubId() {
		return subId;
	}

	public void setSubId(Long subId) {
		this.subId = subId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}