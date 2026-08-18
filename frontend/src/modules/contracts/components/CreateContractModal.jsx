import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { createContractApi } from "../services/contractApi";
import { toast } from "react-toastify";
import { Briefcase, User, IndianRupee, ShieldCheck, AlertCircle } from "lucide-react";
import WorkerDetailsModal from "@/modules/worker-profile/components/WorkerDetailsModal";

const CreateContractModal = ({ show, onHide, application }) => {
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);

  useEffect(() => {
    if (application) {
      setAmount("");
      setTerms("");
      setIsSubmitting(false);
    }
  }, [application]);

  if (!application) return null;

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await createContractApi({
        jobId: application.jobId,
        workerId: application.workerId,
        agreedAmount: Number(amount),
        contractTerms: terms,
      });

      toast.success("Contract successfully initialized");
      onHide();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data?.message?.includes("Contract already exists")
      ) {
        toast.info("An active contract already exists for this application");
        onHide();
      } else {
        toast.error("Process failed. Please verify amount and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
            <ShieldCheck size={24} />
          </div>
          Initialize Contract
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-4">
        {/* Deal Summary Card */}
        <div className="bg-light p-3 rounded-4 mb-4 border border-light-subtle">
          <h6 className="text-muted text-uppercase small fw-bold mb-3 ls-wide">Agreement Details</h6>
          <div className="d-flex align-items-center mb-2">
            <Briefcase size={16} className="text-muted me-2" />
            <span className="text-dark fw-semibold">{application.jobTitle}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between text-muted">
            <span className="d-flex align-items-center">
              <User size={16} className="me-2" />
              Worker: <strong className="text-dark ms-1">{application.workerName}</strong>
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
              onClick={() => setShowWorkerDetails(true)}
            >
              View Worker Details
            </button>
          </div>
        </div>

        {/* Input Section */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold small text-muted text-uppercase ls-wide">
            Final Agreed Compensation
          </Form.Label>
          <InputGroup size="lg" className="shadow-sm overflow-hidden rounded-3 border">
            <InputGroup.Text className="bg-white border-0">
              <IndianRupee size={18} className="text-success" />
            </InputGroup.Text>
            <Form.Control
              type="number"
              className="border-0 ps-0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              min="1"
              disabled={isSubmitting}
            />
          </InputGroup>
          <Form.Text className="text-muted d-flex align-items-center mt-2 gap-1">
            <AlertCircle size={14} /> This amount will be sent for the worker to accept.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="fw-bold small text-muted text-uppercase ls-wide">
            Terms (optional)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="rounded-3"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Scope of work, milestones, deadlines..."
            disabled={isSubmitting}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pb-4 px-4">
        <Button 
            variant="link" 
            className="text-muted text-decoration-none me-auto" 
            onClick={onHide}
            disabled={isSubmitting}
        >
          Discard
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
          onClick={handleCreate}
          disabled={!amount || amount <= 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" animation="border" /> Initializing...
            </>
          ) : (
            "Send Agreement"
          )}
        </Button>
      </Modal.Footer>

      <style>{`
        .ls-wide { letter-spacing: 0.05rem; }
        .form-control:focus { box-shadow: none; }
      `}</style>

      <WorkerDetailsModal
        show={showWorkerDetails}
        onHide={() => setShowWorkerDetails(false)}
        workerId={application.workerId}
      />
    </Modal>
  );
};

export default CreateContractModal;