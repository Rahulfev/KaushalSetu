package com.kaushalsetu.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments") // This creates a table named 'payments'
public class Payment {

	@Id
	@Column(name = "txn_id")
	private String txnId;

	@Column(name = "user_name")
	private String userName;

	private BigDecimal amount;

	@Column(name = "payment_date")
	private LocalDateTime paymentDate;

	private String status; // 'COMPLETED', 'PENDING'
	private String type; // 'SUBSCRIPTION', 'JOB_PAYMENT'

	// Getters and Setters
	public String getTxnId() {
		return txnId;
	}

	public void setTxnId(String txnId) {
		this.txnId = txnId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public LocalDateTime getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}