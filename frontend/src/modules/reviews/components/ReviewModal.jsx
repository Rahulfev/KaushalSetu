import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { submitReviewApi } from '../services/reviewApi';

/**
 * Rate & Review modal shown once a contract reaches COMPLETED.
 * Works for both roles: worker reviews the org/client, org/client reviews the worker.
 */
const ReviewModal = ({ show, onHide, contractId, applicationId, revieweeName, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      await submitReviewApi({ contractId, applicationId, rating, comment });
      toast.success('Thanks for your feedback!');
      onSubmitted?.();
      onHide();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate & Review{revieweeName ? ` — ${revieweeName}` : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ cursor: 'pointer' }}
              fill={(hoverRating || rating) >= star ? '#ffc107' : 'none'}
              stroke="#ffc107"
            />
          ))}
        </div>
        <Form.Group>
          <Form.Label className="small fw-bold text-muted">Comments (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your experience?"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide}>Skip</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
